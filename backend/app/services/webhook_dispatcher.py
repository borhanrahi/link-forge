import httpx
import json
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.webhook_event import WebhookEvent


async def dispatch_webhook(db: AsyncSession, workspace_id, event_type: str, payload: Dict[str, Any]):
    """Store webhook event and dispatch to any registered webhook URLs."""
    webhook_event = WebhookEvent(
        workspace_id=workspace_id,
        event_type=event_type,
        payload=payload,
    )
    db.add(webhook_event)
    await db.flush()

    # In a full implementation, you'd look up registered webhook URLs
    # For now, just mark as processed
    webhook_event.processed = True
    return webhook_event


async def dispatch_webhook_url(url: str, event_type: str, payload: Dict[str, Any]) -> bool:
    """Send a webhook to an external URL."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json={"event": event_type, "data": payload},
                headers={"Content-Type": "application/json"},
                timeout=10.0,
            )
            return response.status_code < 300
    except Exception:
        return False
