from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class UTMPresetCreate(BaseModel):
    name: str
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None


class UTMPresetResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UTMBuildRequest(BaseModel):
    url: str
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None


class UTMBuildResponse(BaseModel):
    url: str
    built_url: str
