from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, Request, status, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user
from app.dependencies.db import get_db
from app.models.user import User
from app.models.workspace import Workspace
from app.models.workspace_member import WorkspaceMember
from app.models.api_key import APIKey


async def get_active_workspace(
    request: Request,
    x_workspace_id: Optional[str] = Header(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Workspace:
    # If authenticated via API key, use the key's workspace directly
    api_key: Optional[APIKey] = getattr(request.state, "api_key", None)
    if api_key is not None:
        result = await db.execute(
            select(Workspace).where(Workspace.id == api_key.workspace_id)
        )
        workspace = result.scalar_one_or_none()
        if not workspace:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Workspace not found for this API key",
            )
        return workspace

    # JWT auth — resolve workspace from header or user default
    workspace_id = x_workspace_id or user.default_workspace_id
    if not workspace_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No active workspace")

    result = await db.execute(
        select(Workspace).join(
            WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id
        ).where(
            WorkspaceMember.user_id == user.id,
            Workspace.id == UUID(str(workspace_id)),
            WorkspaceMember.invite_status == "active",
        )
    )
    workspace = result.scalar_one_or_none()

    if not workspace:
        result = await db.execute(select(Workspace).where(
            Workspace.id == UUID(str(workspace_id)),
            Workspace.owner_id == user.id,
        ))
        workspace = result.scalar_one_or_none()

    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")

    return workspace
