import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.user import User
from app.models.workspace import Workspace
from app.models.link import Link
from app.models.bio_page import BioPage
from app.models.tag import Tag
from app.models.utm_preset import UTMPreset

router = APIRouter(prefix="/workspace", tags=["export-import"])


@router.get("/export")
async def export_workspace(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    links_result = await db.execute(
        select(Link).where(Link.workspace_id == workspace.id)
    )
    links = links_result.scalars().all()

    bio_result = await db.execute(
        select(BioPage)
        .options(selectinload(BioPage.blocks))
        .where(BioPage.workspace_id == workspace.id)
    )
    bio_pages = bio_result.scalars().all()

    tags_result = await db.execute(
        select(Tag).where(Tag.workspace_id == workspace.id)
    )
    tags = tags_result.scalars().all()

    utm_result = await db.execute(
        select(UTMPreset).where(UTMPreset.workspace_id == workspace.id)
    )
    utm_presets = utm_result.scalars().all()

    export_data = {
        "workspace": {
            "name": workspace.name,
            "plan": workspace.plan,
        },
        "links": [
            {
                "original_url": l.original_url,
                "title": l.title,
                "short_code": l.short_code,
                "custom_alias": l.custom_alias,
                "is_active": l.is_active,
                "is_cloaked": l.is_cloaked,
                "created_at": l.created_at.isoformat() if l.created_at else None,
            }
            for l in links
        ],
        "bio_pages": [
            {
                "title": p.title,
                "subtitle": p.subtitle,
                "slug": p.slug,
                "theme": p.theme,
                "brand_color": p.brand_color,
                "bg_color": p.bg_color,
                "font_family": p.font_family,
                "blocks": [
                    {
                        "block_type": b.block_type,
                        "label": b.label,
                        "url": b.url,
                        "icon": b.icon,
                        "image_url": b.image_url,
                        "position": b.position,
                    }
                    for b in (p.blocks or [])
                ],
            }
            for p in bio_pages
        ],
        "tags": [{"name": t.name, "color": t.color} for t in tags],
        "utm_presets": [
            {
                "name": p.name,
                "utm_source": p.utm_source,
                "utm_medium": p.utm_medium,
                "utm_campaign": p.utm_campaign,
                "utm_content": p.utm_content,
                "utm_term": p.utm_term,
            }
            for p in utm_presets
        ],
    }

    content = json.dumps(export_data, indent=2)
    return StreamingResponse(
        iter([content]),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=linknest-export-{workspace.slug}.json"},
    )
