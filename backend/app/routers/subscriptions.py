from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.user import User
from app.models.workspace import Workspace
from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionResponse

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.get("/current")
async def current_subscription(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Subscription).where(
            Subscription.workspace_id == workspace.id,
            Subscription.status.in_(["active", "trialing", "past_due"]),
        ).order_by(Subscription.created_at.desc())
    )
    sub = result.scalar_one_or_none()
    if not sub:
        # Return a free plan by default
        resp = SubscriptionResponse(
            id=None,
            workspace_id=workspace.id,
            plan="free",
            status="active",
            created_at=workspace.created_at,
        )
        return resp
    return SubscriptionResponse.model_validate(sub)


@router.post("/upgrade")
async def upgrade_plan(
    plan: str,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    if plan not in ("pro", "business"):
        raise HTTPException(status_code=400, detail="Invalid plan")

    # Instant dummy activation: create/update subscription and workspace plan
    result = await db.execute(
        select(Subscription).where(
            Subscription.workspace_id == workspace.id,
        ).order_by(Subscription.created_at.desc())
    )
    sub = result.scalar_one_or_none()
    if sub:
        sub.plan = plan
        sub.status = "active"
    else:
        from datetime import datetime, timedelta
        sub = Subscription(
            workspace_id=workspace.id,
            plan=plan,
            status="active",
            current_period_start=datetime.utcnow(),
            current_period_end=datetime.utcnow() + timedelta(days=30),
        )
        db.add(sub)

    workspace.plan = plan
    await db.commit()

    return {"message": f"Upgraded to {plan} successfully", "plan": plan}


@router.post("/downgrade")
async def downgrade_plan(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    workspace.plan = "free"
    await db.commit()
    return {"message": "Downgraded to Free plan", "plan": "free"}


@router.post("/cancel")
async def cancel_subscription(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Subscription).where(
            Subscription.workspace_id == workspace.id,
            Subscription.status == "active",
        )
    )
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=404, detail="No active subscription")
    sub.cancel_at_period_end = True
    sub.status = "canceled"
    workspace.plan = "free"
    await db.commit()
    return {"message": "Subscription cancelled, reverted to Free plan"}
