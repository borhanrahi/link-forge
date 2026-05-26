from urllib.parse import urlencode, urlparse, parse_qs
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.utm_preset import UTMPreset
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.utm import UTMPresetCreate, UTMPresetResponse, UTMBuildRequest, UTMBuildResponse

router = APIRouter(prefix="/utm", tags=["utm"])


@router.get("/presets")
async def list_presets(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UTMPreset).where(UTMPreset.workspace_id == workspace.id)
    )
    presets = result.scalars().all()
    return [UTMPresetResponse.model_validate(p) for p in presets]


@router.post("/presets", status_code=201)
async def create_preset(
    body: UTMPresetCreate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    preset = UTMPreset(
        workspace_id=workspace.id,
        name=body.name,
        utm_source=body.utm_source,
        utm_medium=body.utm_medium,
        utm_campaign=body.utm_campaign,
        utm_content=body.utm_content,
        utm_term=body.utm_term,
    )
    db.add(preset)
    await db.commit()
    return UTMPresetResponse.model_validate(preset)


@router.delete("/presets/{preset_id}")
async def delete_preset(
    preset_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(UTMPreset).where(UTMPreset.id == preset_id, UTMPreset.workspace_id == workspace.id)
    )
    preset = result.scalar_one_or_none()
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    await db.delete(preset)
    await db.commit()
    return {"message": "Preset deleted"}


@router.post("/build")
async def build_url(
    body: UTMBuildRequest,
    user: User = Depends(get_current_user),
):
    parsed = urlparse(body.url)
    existing = parse_qs(parsed.query, keep_blank_values=True)
    params = {k: v[0] for k, v in existing.items()}

    if body.utm_source:
        params["utm_source"] = body.utm_source
    if body.utm_medium:
        params["utm_medium"] = body.utm_medium
    if body.utm_campaign:
        params["utm_campaign"] = body.utm_campaign
    if body.utm_content:
        params["utm_content"] = body.utm_content
    if body.utm_term:
        params["utm_term"] = body.utm_term

    query_string = urlencode(params)
    built = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
    if query_string:
        built += f"?{query_string}"

    return UTMBuildResponse(url=body.url, built_url=built)
