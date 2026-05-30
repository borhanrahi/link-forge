from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.user import User
from app.models.workspace import Workspace
from app.models.click_goal_alert import ClickGoalAlert
from app.models.link import Link
from app.schemas.click_goal_alert import ClickGoalAlertCreate, ClickGoalAlertResponse
from app.services.email_service import send_goal_alert_email

router = APIRouter(prefix="/alerts", tags=["click-goal-alerts"])


@router.get("")
async def list_alerts(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ClickGoalAlert)
        .where(ClickGoalAlert.workspace_id == workspace.id)
        .order_by(ClickGoalAlert.created_at.desc())
    )
    alerts = result.scalars().all()
    return [ClickGoalAlertResponse.model_validate(a) for a in alerts]


@router.post("", status_code=201)
async def create_alert(
    body: ClickGoalAlertCreate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    link_result = await db.execute(
        select(Link).where(Link.id == body.link_id, Link.workspace_id == workspace.id)
    )
    if not link_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Link not found")

    alert = ClickGoalAlert(
        workspace_id=workspace.id,
        user_id=user.id,
        link_id=body.link_id,
        goal_clicks=body.goal_clicks,
        notify_email=body.notify_email,
        notify_dashboard=body.notify_dashboard,
    )
    db.add(alert)
    await db.commit()
    return ClickGoalAlertResponse.model_validate(alert)


@router.delete("/{alert_id}")
async def delete_alert(
    alert_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ClickGoalAlert).where(
            ClickGoalAlert.id == alert_id,
            ClickGoalAlert.workspace_id == workspace.id,
        )
    )
    alert = result.scalar_one_or_none()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    await db.delete(alert)
    await db.commit()
    return {"message": "Alert deleted"}
