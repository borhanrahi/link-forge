from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_db
from app.models.link import Link
from app.services.click_tracker import log_click

router = APIRouter(tags=["redirect"])


@router.get("/{short_code}")
async def redirect_to_url(short_code: str, request: Request, db: AsyncSession = Depends(get_db)):
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
    if not link:
        raise HTTPException(status_code=404, detail="Link not found or inactive")

    if link.expires_at and link.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="Link has expired")

    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")
    ref = request.headers.get("referer")

    await log_click(db, link.id, ip, ua, ref)
    await db.commit()

    return RedirectResponse(url=link.original_url, status_code=307)
