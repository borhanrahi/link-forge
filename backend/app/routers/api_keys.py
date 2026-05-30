from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.user import User
from app.models.workspace import Workspace
from app.models.api_key import APIKey
from app.schemas.api_key import APIKeyCreate, APIKeyResponse, APIKeyCreatedResponse

router = APIRouter(prefix="/api-keys", tags=["api-keys"])


@router.get("")
async def list_api_keys(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(APIKey).where(APIKey.workspace_id == workspace.id).order_by(APIKey.created_at.desc())
    )
    keys = result.scalars().all()
    return [APIKeyResponse.model_validate(k) for k in keys]


@router.post("", status_code=201)
async def create_api_key(
    body: APIKeyCreate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    raw_key, key_hash, key_prefix = APIKey.generate_key()
    api_key = APIKey(
        workspace_id=workspace.id,
        user_id=user.id,
        name=body.name,
        key_hash=key_hash,
        key_prefix=key_prefix,
        scopes=body.scopes,
        expires_at=body.expires_at,
    )
    db.add(api_key)
    await db.commit()
    return APIKeyCreatedResponse(
        id=api_key.id,
        name=api_key.name,
        key=raw_key,
        key_prefix=key_prefix,
        scopes=api_key.scopes,
        created_at=api_key.created_at,
    )


@router.delete("/{key_id}")
async def revoke_api_key(
    key_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(APIKey).where(APIKey.id == key_id, APIKey.workspace_id == workspace.id)
    )
    key = result.scalar_one_or_none()
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
    await db.delete(key)
    await db.commit()
    return {"message": "API key revoked"}
