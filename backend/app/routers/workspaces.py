from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.dependencies.permissions import require_role
from app.models.user import User
from app.models.workspace import Workspace
from app.models.workspace_member import WorkspaceMember
from app.schemas.workspace import (
    WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse,
    MemberResponse, InviteRequest, MemberRoleUpdate,
)

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.get("")
async def list_workspaces(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Workspace).join(WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id)
        .where(WorkspaceMember.user_id == user.id, WorkspaceMember.invite_status == "active")
    )
    owned = await db.execute(select(Workspace).where(Workspace.owner_id == user.id))
    ws_set = {w.id: w for w in result.scalars().all()}
    for w in owned.scalars().all():
        ws_set[w.id] = w
    return [WorkspaceResponse.model_validate(w) for w in ws_set.values()]


@router.post("", status_code=201)
async def create_workspace(
    body: WorkspaceCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ws = Workspace(
        name=body.name,
        slug=body.name.lower().replace(" ", "-")[:50],
        owner_id=user.id,
    )
    db.add(ws)
    await db.commit()
    return WorkspaceResponse.model_validate(ws)


@router.get("/{workspace_id}")
async def get_workspace(
    workspace_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id))
    ws = result.scalar_one_or_none()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    members_result = await db.execute(
        select(WorkspaceMember).where(WorkspaceMember.workspace_id == workspace_id)
    )
    members = members_result.scalars().all()
    return {
        **WorkspaceResponse.model_validate(ws).model_dump(),
        "member_count": len(members),
    }


@router.patch("/{workspace_id}")
async def update_workspace(
    workspace_id: UUID,
    body: WorkspaceUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id))
    ws = result.scalar_one_or_none()
    if not ws or ws.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the owner can update workspace")
    if body.name is not None:
        ws.name = body.name
    if body.branding_enabled is not None:
        ws.branding_enabled = body.branding_enabled
    if body.custom_colors_enabled is not None:
        ws.custom_colors_enabled = body.custom_colors_enabled
    await db.commit()
    return WorkspaceResponse.model_validate(ws)


@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id))
    ws = result.scalar_one_or_none()
    if not ws or ws.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the owner can delete workspace")
    await db.delete(ws)
    await db.commit()
    return {"message": "Workspace deleted"}


@router.post("/{workspace_id}/invite")
async def invite_member(
    workspace_id: UUID,
    body: InviteRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await require_role(["owner", "admin"], user, await get_active_workspace(user, db), db)
    result = await db.execute(select(User).where(User.email == body.email))
    target = result.scalar_one_or_none()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    existing = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == target.id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Already a member")

    member = WorkspaceMember(
        workspace_id=workspace_id,
        user_id=target.id,
        role=body.role,
        invited_by=user.id,
        invite_status="active",
    )
    db.add(member)
    await db.commit()
    return {"message": "Member invited"}


@router.get("/{workspace_id}/members")
async def list_members(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WorkspaceMember).where(WorkspaceMember.workspace_id == workspace_id)
    )
    members = result.scalars().all()
    resp = []
    for m in members:
        u_result = await db.execute(select(User).where(User.id == m.user_id))
        u = u_result.scalar_one_or_none()
        resp.append(MemberResponse(
            id=m.id,
            user_id=m.user_id,
            email=u.email if u else "",
            full_name=u.full_name if u else "",
            role=m.role,
            invite_status=m.invite_status,
            joined_at=m.joined_at,
        ))
    return resp


@router.patch("/{workspace_id}/members/{user_id}")
async def update_member_role(
    workspace_id: UUID,
    user_id: UUID,
    body: MemberRoleUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await require_role(["owner", "admin"], user, await get_active_workspace(user, db), db)
    result = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == user_id,
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    member.role = body.role
    await db.commit()
    return {"message": "Role updated"}


@router.delete("/{workspace_id}/members/{user_id}")
async def remove_member(
    workspace_id: UUID,
    user_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await require_role(["owner", "admin"], user, await get_active_workspace(user, db), db)
    result = await db.execute(
        select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == user_id,
        )
    )
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    await db.delete(member)
    await db.commit()
    return {"message": "Member removed"}


@router.post("/{workspace_id}/switch")
async def switch_workspace(
    workspace_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user.default_workspace_id = workspace_id
    await db.commit()
    return {"message": "Active workspace switched"}
