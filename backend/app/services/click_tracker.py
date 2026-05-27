import hashlib
import logging
from typing import Optional
from uuid import UUID
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.click import Click
from app.models.link import Link
from app.models.notification import Notification
from app.services.geo_ip import geo_ip_service

logger = logging.getLogger(__name__)


def hash_ip(ip_address: str) -> str:
    return hashlib.sha256(ip_address.encode()).hexdigest()


async def log_click(
    db: AsyncSession,
    link_id: UUID,
    ip_address: Optional[str],
    user_agent: Optional[str],
    referrer: Optional[str],
) -> Click:
    ip_hash = hash_ip(ip_address) if ip_address else None
    country_code = None
    city = None

    if ip_address:
        try:
            country_code, city = await geo_ip_service.lookup(ip_address)
        except Exception as e:
            logger.warning(f"GeoIP lookup failed: {e}")

    device_type = "desktop"
    browser = None
    os = None
    ua_lower = (user_agent or "").lower()
    if "mobile" in ua_lower or "android" in ua_lower or "iphone" in ua_lower:
        device_type = "mobile"
    elif "tablet" in ua_lower or "ipad" in ua_lower:
        device_type = "tablet"
    if "bot" in ua_lower or "crawler" in ua_lower or "spider" in ua_lower:
        device_type = "bot"

    click = Click(
        link_id=link_id,
        ip_address=ip_address,
        ip_hash=ip_hash,
        country_code=country_code,
        city=city,
        user_agent=user_agent,
        device_type=device_type,
        browser=browser,
        os=os,
        referrer=referrer,
        clicked_at=datetime.utcnow(),
    )
    db.add(click)

    stmt = select(Link).where(Link.id == link_id)
    result = await db.execute(stmt)
    link = result.scalar_one_or_none()
    if link:
        link.clicks_count = (link.clicks_count or 0) + 1

    if link and link.user_id:
        notif = Notification(
            workspace_id=link.workspace_id,
            user_id=link.user_id,
            type="link_click",
            title=f"New click on {link.title or link.short_code}",
            message=f"Clicked from {country_code or 'Unknown'} via {device_type}",
            link_id=link.id,
            link_title=link.title,
        )
        db.add(notif)

    return click
