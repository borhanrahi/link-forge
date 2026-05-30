import csv
import io
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.dependencies.permissions import require_role
from app.models.link import Link
from app.models.tag import LinkTag
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
    links = result.scalars().unique().all()
    link_data = []
    for l in links:
        resp = LinkResponse.model_validate(l)
        resp.tags = []
        link_data.append(resp)
    return link_data


@router.post("", status_code=201)
async def create_link(
    body: LinkCreate,
    utm_preset_id: Optional[str] = Query(None),
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    if not await check_feature_limit(db, workspace.id, "links"):
        raise HTTPException(status_code=403, detail="Link limit reached for your plan")

    short_code = generate_short_code()

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
        publish_at=body.publish_at,
        position=body.position or 0,
    )
    if body.password:
        from app.dependencies.auth import hash_password
        link.password_hash = hash_password(body.password)

    if utm_preset_id:
        from app.models.utm_preset import UTMPreset
        result = await db.execute(
            select(UTMPreset).where(UTMPreset.id == utm_preset_id, UTMPreset.workspace_id == workspace.id)
        )
        preset = result.scalar_one_or_none()
        if preset:
            separator = "&" if "?" in link.original_url else "?"
            utm_params = []
            if preset.utm_source:
                utm_params.append(f"utm_source={preset.utm_source}")
            if preset.utm_medium:
                utm_params.append(f"utm_medium={preset.utm_medium}")
            if preset.utm_campaign:
                utm_params.append(f"utm_campaign={preset.utm_campaign}")
            if preset.utm_term:
                utm_params.append(f"utm_term={preset.utm_term}")
            if preset.utm_content:
                utm_params.append(f"utm_content={preset.utm_content}")
            if utm_params:
                link.original_url = f"{link.original_url}{separator}{'&'.join(utm_params)}"

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
    if body.publish_at is not None:
        link.publish_at = body.publish_at
    if body.position is not None:
        link.position = body.position
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


@router.post("/bulk/action")
async def bulk_action(
    body: dict,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    link_ids = body.get("link_ids", [])
    action = body.get("action")  # "archive", "restore", "delete"

    result = await db.execute(
        select(Link).where(Link.id.in_(link_ids), Link.workspace_id == workspace.id)
    )
    links = result.scalars().all()

    for link in links:
        if action == "archive":
            link.is_active = False
        elif action == "restore":
            link.is_active = True
        elif action == "delete":
            await db.delete(link)

    await db.commit()
    return {"affected": len(links)}


@router.post("/reorder")
async def reorder_links(
    body: dict,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    link_ids = body.get("link_ids", [])
    for idx, lid in enumerate(link_ids):
        result = await db.execute(
            select(Link).where(Link.id == lid, Link.workspace_id == workspace.id)
        )
        link = result.scalar_one_or_none()
        if link:
            link.position = idx
    await db.commit()
    return {"message": "Links reordered"}
