import json
import hmac
import hashlib

from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_db
from app.config import get_settings
from app.models.webhook_event import WebhookEvent
from app.models.subscription import Subscription
from app.services.webhook_dispatcher import dispatch_webhook

settings = get_settings()
router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/generic")
async def generic_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    payload = await request.json()
    event_type = payload.get("type", "unknown")

    webhook_event = WebhookEvent(
        event_type=event_type,
        payload=payload,
    )
    db.add(webhook_event)
    await db.commit()

    return {"received": True}


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    body = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    # Verify webhook signature in production
    if settings.stripe_webhook_secret:
        try:
            import stripe
            stripe.Webhook.construct_event(body, sig_header, settings.stripe_webhook_secret)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid signature")

    payload = await request.json()
    event_type = payload.get("type", "")

    webhook_event = WebhookEvent(
        event_type=f"stripe.{event_type}",
        payload=payload,
    )
    db.add(webhook_event)

    # Handle key events
    if event_type == "checkout.session.completed":
        workspace_id = payload.get("data", {}).get("object", {}).get("metadata", {}).get("workspace_id")
        if workspace_id:
            result = await db.execute(
                select(Subscription).where(Subscription.workspace_id == workspace_id)
            )
            sub = result.scalar_one_or_none()
            if sub:
                sub.status = "active"
                sub.stripe_subscription_id = payload["data"]["object"].get("subscription")

    await db.commit()
    return {"received": True}
