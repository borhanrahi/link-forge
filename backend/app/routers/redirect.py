import hashlib
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_db
from app.models.link import Link
from app.models.click import Click

router = APIRouter(tags=["redirect"])


@router.get("/{short_code}")
async def redirect_to_url(short_code: str, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Link).where(Link.short_code == short_code, Link.is_active == True))
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found or inactive")

    if link.expires_at and link.expires_at < datetime.utcnow():
        raise HTTPException(status_code=410, detail="Link has expired")

    client_ip = request.client.host if request.client else "0.0.0.0"
    ua = request.headers.get("user-agent", "")
    referrer = request.headers.get("referer", "")

    click = Click(
        link_id=link.id,
        ip_hash=hashlib.sha256(client_ip.encode()).hexdigest(),
        user_agent=ua,
        referrer=referrer,
    )
    db.add(click)
    link.clicks_count = (link.clicks_count or 0) + 1
    await db.commit()

    return RedirectResponse(url=link.original_url, status_code=302)
