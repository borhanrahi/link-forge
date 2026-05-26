from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db, hash_password
from app.dependencies.workspace import get_active_workspace
from app.models.user import User
from app.models.workspace import Workspace
from app.models.bio_page import BioPage
from app.models.bio_block import BioBlock
from app.schemas.bio_page import BioPageCreate, BioPageUpdate, BioPageResponse
from app.schemas.bio_block import BioBlockCreate, BioBlockUpdate, BioBlockResponse, ReorderRequest
from app.services.quota_enforcer import check_feature_limit, increment_feature_usage

router = APIRouter(prefix="/bio-pages", tags=["bio-pages"])


@router.get("")
async def list_bio_pages(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BioPage).where(BioPage.workspace_id == workspace.id).order_by(BioPage.created_at.desc())
    )
    pages = result.scalars().all()
    return [BioPageResponse.model_validate(p) for p in pages]


@router.post("", status_code=201)
async def create_bio_page(
    body: BioPageCreate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    if not await check_feature_limit(db, workspace.id, "bio_pages"):
        raise HTTPException(status_code=403, detail="Bio page limit reached")

    existing = await db.execute(select(BioPage).where(BioPage.slug == body.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Slug already taken")

    page = BioPage(
        workspace_id=workspace.id,
        user_id=user.id,
        title=body.title,
        subtitle=body.subtitle,
        slug=body.slug,
        theme=body.theme,
        brand_color=body.brand_color,
        bg_color=body.bg_color,
        font_family=body.font_family,
    )
    db.add(page)
    await increment_feature_usage(db, workspace.id, "bio_pages")
    await db.commit()
    return BioPageResponse.model_validate(page)


@router.get("/{page_id}")
async def get_bio_page(
    page_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BioPage).where(BioPage.id == page_id, BioPage.workspace_id == workspace.id)
    )
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    blocks_result = await db.execute(
        select(BioBlock).where(BioBlock.bio_page_id == page_id).order_by(BioBlock.position)
    )
    blocks = blocks_result.scalars().all()
    resp = BioPageResponse.model_validate(page)
    resp.blocks = [BioBlockResponse.model_validate(b) for b in blocks]
    return resp


@router.patch("/{page_id}")
async def update_bio_page(
    page_id: UUID,
    body: BioPageUpdate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BioPage).where(BioPage.id == page_id, BioPage.workspace_id == workspace.id)
    )
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Bio page not found")

    for field, value in body.model_dump(exclude_unset=True).items():
        if field == "password" and value is not None:
            setattr(page, "password_hash", hash_password(value))
        elif field != "password":
            setattr(page, field, value)
    await db.commit()
    return BioPageResponse.model_validate(page)


@router.delete("/{page_id}")
async def delete_bio_page(
    page_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BioPage).where(BioPage.id == page_id, BioPage.workspace_id == workspace.id)
    )
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    await db.delete(page)
    await db.commit()
    return {"message": "Bio page deleted"}


@router.post("/{page_id}/publish")
async def toggle_publish(
    page_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BioPage).where(BioPage.id == page_id, BioPage.workspace_id == workspace.id)
    )
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Bio page not found")
    page.is_published = not page.is_published
    await db.commit()
    return {"is_published": page.is_published}


@router.post("/{page_id}/blocks", status_code=201)
async def add_block(
    page_id: UUID,
    body: BioBlockCreate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    block = BioBlock(
        bio_page_id=page_id,
        block_type=body.block_type,
        label=body.label,
        url=body.url,
        icon=body.icon,
        image_url=body.image_url,
        video_url=body.video_url,
        embed_html=body.embed_html,
        position=body.position,
        visible_from=body.visible_from,
        visible_until=body.visible_until,
    )
    db.add(block)
    await db.commit()
    return BioBlockResponse.model_validate(block)


@router.patch("/{page_id}/blocks/{block_id}")
async def update_block(
    page_id: UUID,
    block_id: UUID,
    body: BioBlockUpdate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BioBlock).where(BioBlock.id == block_id, BioBlock.bio_page_id == page_id)
    )
    block = result.scalar_one_or_none()
    if not block:
        raise HTTPException(status_code=404, detail="Block not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(block, field, value)
    await db.commit()
    return BioBlockResponse.model_validate(block)


@router.delete("/{page_id}/blocks/{block_id}")
async def delete_block(
    page_id: UUID,
    block_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BioBlock).where(BioBlock.id == block_id, BioBlock.bio_page_id == page_id)
    )
    block = result.scalar_one_or_none()
    if not block:
        raise HTTPException(status_code=404, detail="Block not found")
    await db.delete(block)
    await db.commit()
    return {"message": "Block deleted"}


@router.patch("/{page_id}/reorder")
async def reorder_blocks(
    page_id: UUID,
    body: ReorderRequest,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    for idx, block_id in enumerate(body.block_ids):
        result = await db.execute(
            select(BioBlock).where(BioBlock.id == block_id, BioBlock.bio_page_id == page_id)
        )
        block = result.scalar_one_or_none()
        if block:
            block.position = idx
    await db.commit()
    return {"message": "Blocks reordered"}
