import csv
import io
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.dependencies.permissions import require_role
from app.models.link import Link
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.link import LinkCreate, LinkUpdate, LinkResponse, BulkCreateItem
from app.services.short_code import generate_short_code
from app.services.quota_enforcer import check_feature_limit, increment_feature_usage

router = APIRouter(prefix="/links", tags=["links"])


@router.get("")
async def list_links(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    query = select(Link).where(Link.workspace_id == workspace.id, Link.is_active == True)
    if search:
        query = query.where(
            or_(
                Link.title.ilike(f"%{search}%"),
                Link.original_url.ilike(f"%{search}%"),
                Link.short_code.ilike(f"%{search}%"),
            )
        )
    query = query.order_by(Link.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    links = result.scalars().all()
    return [LinkResponse.model_validate(l) for l in links]


@router.post("", status_code=201)
async def create_link(
    body: LinkCreate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    if not await check_feature_limit(db, workspace.id, "links"):
        raise HTTPException(status_code=403, detail="Link limit reached for your plan")

    max_id_result = await db.execute(select(func.max(Link.id)))
    next_id = 1
    short_code = generate_short_code(next_id)

    if body.custom_alias:
        alias_check = await db.execute(select(Link).where(Link.custom_alias == body.custom_alias))
        if alias_check.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="Alias already taken")
        short_code = body.custom_alias

    link = Link(
        workspace_id=workspace.id,
        user_id=user.id,
        original_url=body.original_url,
        short_code=short_code,
        custom_alias=body.custom_alias,
        title=body.title,
        is_cloaked=body.is_cloaked,
        expires_at=body.expires_at,
    )
    if body.password:
        from app.dependencies.auth import hash_password
        link.password_hash = hash_password(body.password)

    db.add(link)
    await increment_feature_usage(db, workspace.id, "links")
    await db.commit()
    return LinkResponse.model_validate(link)


@router.get("/{link_id}")
async def get_link(
    link_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Link).where(Link.id == link_id, Link.workspace_id == workspace.id)
    )
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    return LinkResponse.model_validate(link)


@router.patch("/{link_id}")
async def update_link(
    link_id: UUID,
    body: LinkUpdate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Link).where(Link.id == link_id, Link.workspace_id == workspace.id)
    )
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    if body.original_url is not None:
        link.original_url = body.original_url
    if body.title is not None:
        link.title = body.title
    if body.is_active is not None:
        link.is_active = body.is_active
    if body.is_cloaked is not None:
        link.is_cloaked = body.is_cloaked
    if body.expires_at is not None:
        link.expires_at = body.expires_at
    if body.password is not None:
        from app.dependencies.auth import hash_password
        link.password_hash = hash_password(body.password)
    await db.commit()
    return LinkResponse.model_validate(link)


@router.delete("/{link_id}")
async def delete_link(
    link_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Link).where(Link.id == link_id, Link.workspace_id == workspace.id)
    )
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    link.is_active = False
    await db.commit()
    return {"message": "Link archived"}


@router.post("/{link_id}/restore")
async def restore_link(
    link_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Link).where(Link.id == link_id, Link.workspace_id == workspace.id)
    )
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    link.is_active = True
    link.expires_at = None
    await db.commit()
    return {"message": "Link restored"}


@router.post("/bulk")
async def bulk_create(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    content = await file.read()
    text = content.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(text))
    created = []
    for row in reader:
        link = Link(
            workspace_id=workspace.id,
            user_id=user.id,
            original_url=row["url"],
            title=row.get("title"),
            short_code=generate_short_code(1),
        )
        db.add(link)
        created.append(link)
    await db.commit()
    return {"created": len(created)}
