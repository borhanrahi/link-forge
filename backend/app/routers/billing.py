from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.user import User
from app.models.workspace import Workspace
from app.models.subscription import Subscription
from app.schemas.billing import PlanResponse, InvoiceResponse, CheckoutRequest, CheckoutResponse
from app.schemas.subscription import SubscriptionResponse
from app.services.stripe_service import create_checkout_session, create_portal_session, cancel_subscription

settings = get_settings()
router = APIRouter(prefix="/billing", tags=["billing"])

PLANS = [
    PlanResponse(id="free", name="Free", price=0, features=["10 links", "1 bio page", "Basic analytics"]),
    PlanResponse(id="pro", name="Pro", price=1900, features=["Unlimited links", "3 bio pages", "Full analytics", "1 custom domain", "Priority support"]),
    PlanResponse(id="business", name="Business", price=4900, features=["Unlimited everything", "Team workspaces", "5 custom domains", "API access", "Dedicated support"]),
]


@router.get("/plans")
async def list_plans(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Subscription).where(
            Subscription.workspace_id == workspace.id,
            Subscription.status.in_(["active", "trialing"]),
        )
    )
    current_sub = result.scalar_one_or_none()
    return {
        "plans": PLANS,
        "current_plan": workspace.plan,
        "subscription": SubscriptionResponse.model_validate(current_sub) if current_sub else None,
    }


@router.get("/invoices")
async def list_invoices(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    from app.models.invoice import Invoice
    result = await db.execute(
        select(Invoice).where(Invoice.workspace_id == workspace.id).order_by(Invoice.created_at.desc())
    )
    invoices = result.scalars().all()
    return [InvoiceResponse.model_validate(i) for i in invoices]


@router.post("/checkout")
async def checkout(
    body: CheckoutRequest,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    success_url = body.success_url or f"{settings.frontend_url}/dashboard/billing?success=true"
    cancel_url = body.cancel_url or f"{settings.frontend_url}/dashboard/billing?canceled=true"

    result = await create_checkout_session(
        price_id=body.price_id,
        workspace_id=str(workspace.id),
        success_url=success_url,
        cancel_url=cancel_url,
        customer_email=user.email,
    )
    return CheckoutResponse(url=result["url"], session_id=result["session_id"])


@router.post("/portal")
async def customer_portal(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await create_portal_session(
        customer_id=user.stripe_customer_id or "",
        return_url=f"{settings.frontend_url}/dashboard/billing",
    )
    return {"url": result["url"]}
