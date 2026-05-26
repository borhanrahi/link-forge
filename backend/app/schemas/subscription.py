from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class SubscriptionResponse(BaseModel):
    id: Optional[UUID] = None
    workspace_id: UUID
    plan: str
    status: str
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at_period_end: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
