import logging
from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select

from app.models.click import Click
from app.models.link import Link

logger = logging.getLogger(__name__)


async def cleanup_expired_links(db: AsyncSession) -> int:
    now = datetime.utcnow()
    result = await db.execute(select(Link).where(
        Link.expires_at.isnot(None),
        Link.expires_at < now,
        Link.is_active == True,
    ))
    expired = result.scalars().all()
    count = 0
    for link in expired:
        link.is_active = False
        count += 1
    if count:
        await db.commit()
        logger.info(f"Archived {count} expired links")
    return count
