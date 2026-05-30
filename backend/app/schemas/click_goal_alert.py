from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class ClickGoalAlertCreate(BaseModel):
    link_id: UUID
    goal_clicks: int
    notify_email: bool = True
    notify_dashboard: bool = True


class ClickGoalAlertResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    user_id: UUID
    link_id: UUID
    goal_clicks: int
    is_achieved: bool
    achieved_at: Optional[datetime] = None
    notify_email: bool
    notify_dashboard: bool
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
