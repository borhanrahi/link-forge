from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.click import Click
from app.models.link import Link
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.click import ClickResponse

router = APIRouter(prefix="/clicks", tags=["clicks"])


@router.get("")
async def list_clicks(
    skip: int = 0,
    limit: int = 100,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    link_ids_q = await db.execute(
        select(Link.id).where(Link.workspace_id == workspace.id)
    )
    link_ids = [r[0] for r in link_ids_q.all()]
    if not link_ids:
        return []

    result = await db.execute(
        select(Click)
        .where(Click.link_id.in_(link_ids))
        .order_by(Click.clicked_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return [ClickResponse.model_validate(c) for c in result.scalars().all()]
