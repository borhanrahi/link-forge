import hashlib
import random
from uuid import UUID
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.dependencies.auth import get_db
from app.models.link import Link
from app.models.qr_code import QRCode
from app.models.ab_test import ABTest, ABTestVariant
from app.services.click_tracker import log_click

router = APIRouter(tags=["redirect"])


def _pick_variant(variants: list[ABTestVariant]) -> ABTestVariant:
    """Pick a variant based on weighted random selection."""
    total_weight = sum(v.weight for v in variants)
    r = random.uniform(0, total_weight)
    cumulative = 0.0
    for v in variants:
        cumulative += v.weight
        if r <= cumulative:
            return v
    return variants[-1]


@router.get("/{short_code}")
async def redirect_to_url(short_code: str, request: Request, db: AsyncSession = Depends(get_db)):
    # First check if it's a regular link
    result = await db.execute(
        select(Link).where(
            Link.short_code == short_code,
            Link.is_active == True,
        )
    )
    link = result.scalar_one_or_none()
    if not link:
        result = await db.execute(
            select(Link).where(
                Link.custom_alias == short_code,
                Link.is_active == True,
            )
        )
        link = result.scalar_one_or_none()
    
    if link:
        if link.expires_at and link.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(status_code=410, detail="Link has expired")

        qr_id = request.query_params.get("qr")
        if qr_id:
            try:
                qr_uuid = UUID(qr_id)
                qr_result = await db.execute(select(QRCode).where(QRCode.id == qr_uuid, QRCode.link_id == link.id))
                qr = qr_result.scalar_one_or_none()
                if qr:
                    qr.scan_count = (qr.scan_count or 0) + 1
            except (ValueError, Exception):
                pass

        ip = request.client.host if request.client else None
        ua = request.headers.get("user-agent")
        ref = request.headers.get("referer")

        await log_click(db, link.id, ip, ua, ref)
        await db.commit()
        return RedirectResponse(url=link.original_url, status_code=307)

    # Check if it's an A/B test short_code
    result = await db.execute(
        select(ABTest)
        .options(selectinload(ABTest.variants))
        .where(ABTest.short_code == short_code, ABTest.is_active == True)
    )
    ab_test = result.scalar_one_or_none()
    if not ab_test:
        raise HTTPException(status_code=404, detail="Link not found or inactive")

    if not ab_test.variants:
        raise HTTPException(status_code=404, detail="A/B test has no variants")

    # Pick a variant based on weights
    variant = _pick_variant(ab_test.variants)

    # Increment variant clicks_count
    variant.clicks_count = (variant.clicks_count or 0) + 1

    # Log A/B test click separately (no link record, just variant tracking)
    from app.models.click import Click
    from app.services.geo_ip import geo_ip_service

    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")
    ref = request.headers.get("referer")

    ip_hash = None
    country_code = None
    if ip:
        ip_hash = hashlib.sha256(ip.encode()).hexdigest()
        try:
            country_code, _ = await geo_ip_service.lookup(ip)
        except Exception:
            pass

    device_type = "desktop"
    ua_lower = (ua or "").lower()
    if "mobile" in ua_lower or "android" in ua_lower or "iphone" in ua_lower:
        device_type = "mobile"
    elif "tablet" in ua_lower or "ipad" in ua_lower:
        device_type = "tablet"

    click = Click(
        link_id=None,
        ab_test_variant_id=variant.id,
        ip_address=ip,
        ip_hash=ip_hash,
        country_code=country_code,
        user_agent=ua,
        device_type=device_type,
        referrer=ref,
        clicked_at=datetime.utcnow(),
    )
    db.add(click)
    await db.commit()

    return RedirectResponse(url=variant.url, status_code=307)
