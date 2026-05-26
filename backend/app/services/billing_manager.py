from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.subscription import Subscription
from app.models.workspace import Workspace
from app.config import get_settings

settings = get_settings()

PLAN_PRICES = {
    "pro": 1900,     # $19.00
    "business": 4900, # $49.00
}


async def create_checkout_session(
    workspace_id: UUID,
    price_id: str,
    success_url: str,
    cancel_url: str,
    customer_id: Optional[str] = None,
) -> Dict[str, Any]:
    # Dummy: map price_id to plan and instantly activate
    plan_map = {
        "price_pro": "pro",
        "price_business": "business",
        settings.stripe_pro_price_id or "price_pro": "pro",
        settings.stripe_business_price_id or "price_business": "business",
    }
    plan = plan_map.get(price_id, "pro")
    return {
        "url": success_url,
        "session_id": f"dummy_{workspace_id}_{plan}",
        "plan": plan,
    }


async def create_customer_portal_session(customer_id: str, return_url: str) -> str:
    return return_url


async def handle_subscription_webhook(
    db: AsyncSession,
    event: Dict[str, Any],
) -> None:
    event_type = event.get("type", "")
    data = event.get("data", {}).get("object", {})

    if event_type.startswith("customer.subscription."):
        stripe_sub_id = data.get("id")
        workspace_id = data.get("metadata", {}).get("workspace_id")
        status = data.get("status")
        plan = data.get("items", {}).get("data", [{}])[0].get("price", {}).get("nickname", "").lower()

        if workspace_id and stripe_sub_id:
            result = await db.execute(
                select(Subscription).where(Subscription.stripe_subscription_id == stripe_sub_id)
            )
            sub = result.scalar_one_or_none()
            if sub:
                sub.status = status
                if plan:
                    sub.plan = plan
            else:
                sub = Subscription(
                    workspace_id=UUID(workspace_id),
                    stripe_subscription_id=stripe_sub_id,
                    status=status,
                    plan=plan or "pro",
                )
                db.add(sub)
            await db.commit()

            if status in ("active", "trialing"):
                ws_result = await db.execute(select(Workspace).where(Workspace.id == UUID(workspace_id)))
                ws = ws_result.scalar_one_or_none()
                if ws:
                    ws.plan = plan or "pro"
                    await db.commit()
