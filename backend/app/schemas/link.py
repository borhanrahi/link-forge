from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class LinkCreate(BaseModel):
    original_url: str
    custom_alias: Optional[str] = None
    title: Optional[str] = None
    password: Optional[str] = None
    is_cloaked: bool = False
    expires_at: Optional[datetime] = None


class LinkUpdate(BaseModel):
    original_url: Optional[str] = None
    title: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_cloaked: Optional[bool] = None
    expires_at: Optional[datetime] = None


class LinkResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    user_id: UUID
    original_url: str
    short_code: str
    custom_alias: Optional[str] = None
    title: Optional[str] = None
    clicks_count: int
    unique_clicks_count: int
    is_active: bool
    is_cloaked: bool
    expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BulkCreateItem(BaseModel):
    original_url: str
    title: Optional[str] = None
    custom_alias: Optional[str] = None


class BulkCreateRequest(BaseModel):
    links: List[BulkCreateItem]
