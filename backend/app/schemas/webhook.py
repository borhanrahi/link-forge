from pydantic import BaseModel
from typing import Any, Dict, Optional


class WebhookPayload(BaseModel):
    event_type: str
    payload: Dict[str, Any]
