import json

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_db
from app.models.webhook_event import WebhookEvent

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
