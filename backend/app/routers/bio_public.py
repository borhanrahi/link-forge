from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_db
from app.models.bio_page import BioPage
from app.models.bio_block import BioBlock
from app.schemas.bio_page import BioPagePublic

router = APIRouter(tags=["bio-public"])


@router.get("/b/{slug}")
async def render_bio_page(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BioPage).where(BioPage.slug == slug, BioPage.is_published == True)
    )
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Bio page not found")

    blocks_result = await db.execute(
        select(BioBlock).where(
            BioBlock.bio_page_id == page.id,
            BioBlock.is_active == True,
        ).order_by(BioBlock.position)
    )
    blocks = blocks_result.scalars().all()

    return {
        "page": BioPagePublic.model_validate(page).model_dump(),
        "blocks": [b for b in blocks],
    }
