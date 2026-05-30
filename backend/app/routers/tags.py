from uuid import UUID
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.user import User
from app.models.workspace import Workspace
from app.models.tag import Tag, LinkTag
from app.models.link import Link
from app.schemas.tag import TagCreate, TagUpdate, TagResponse, LinkTagRequest

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("")
async def list_tags(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Tag).where(Tag.workspace_id == workspace.id).order_by(Tag.name)
    )
    tags = result.scalars().all()
    return [TagResponse.model_validate(t) for t in tags]


@router.post("", status_code=201)
async def create_tag(
    body: TagCreate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    tag = Tag(workspace_id=workspace.id, name=body.name, color=body.color)
    db.add(tag)
    await db.commit()
    return TagResponse.model_validate(tag)


@router.patch("/{tag_id}")
async def update_tag(
    tag_id: UUID,
    body: TagUpdate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Tag).where(Tag.id == tag_id, Tag.workspace_id == workspace.id)
    )
    tag = result.scalar_one_or_none()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    if body.name is not None:
        tag.name = body.name
    if body.color is not None:
        tag.color = body.color
    await db.commit()
    return TagResponse.model_validate(tag)


@router.delete("/{tag_id}")
async def delete_tag(
    tag_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Tag).where(Tag.id == tag_id, Tag.workspace_id == workspace.id)
    )
    tag = result.scalar_one_or_none()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    await db.delete(tag)
    await db.commit()
    return {"message": "Tag deleted"}


@router.post("/link/{link_id}")
async def set_link_tags(
    link_id: UUID,
    body: LinkTagRequest,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    # Verify link belongs to workspace
    link_result = await db.execute(
        select(Link).where(Link.id == link_id, Link.workspace_id == workspace.id)
    )
    if not link_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Link not found")

    # Remove existing tags
    existing = await db.execute(
        select(LinkTag).where(LinkTag.link_id == link_id)
    )
    for lt in existing.scalars().all():
        await db.delete(lt)

    # Add new tags
    for tag_id in body.tag_ids:
        tag_result = await db.execute(
            select(Tag).where(Tag.id == tag_id, Tag.workspace_id == workspace.id)
        )
        if tag_result.scalar_one_or_none():
            db.add(LinkTag(link_id=link_id, tag_id=tag_id))

    await db.commit()
    return {"message": "Tags updated"}
