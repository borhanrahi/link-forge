from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class ClickResponse(BaseModel):
    id: UUID
    link_id: UUID
    ip_hash: Optional[str] = None
    country_code: Optional[str] = None
    city: Optional[str] = None
    user_agent: Optional[str] = None
    device_type: Optional[str] = None
    browser: Optional[str] = None
    os: Optional[str] = None
    referrer: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    clicked_at: datetime

    model_config = {"from_attributes": True}


class ClickExportRow(BaseModel):
    clicked_at: datetime
    country_code: Optional[str] = None
    city: Optional[str] = None
    device_type: Optional[str] = None
    browser: Optional[str] = None
    os: Optional[str] = None
    referrer: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
