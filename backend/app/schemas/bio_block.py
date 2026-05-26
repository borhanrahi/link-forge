from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class BioBlockCreate(BaseModel):
    block_type: str
    label: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    embed_html: Optional[str] = None
    position: int = 0
    visible_from: Optional[datetime] = None
    visible_until: Optional[datetime] = None


class BioBlockUpdate(BaseModel):
    label: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    embed_html: Optional[str] = None
    position: Optional[int] = None
    visible_from: Optional[datetime] = None
    visible_until: Optional[datetime] = None
    is_active: Optional[bool] = None


class BioBlockResponse(BaseModel):
    id: UUID
    bio_page_id: UUID
    block_type: str
    label: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    embed_html: Optional[str] = None
    position: int
    is_active: bool
    click_tracking_enabled: bool
    clicks_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ReorderRequest(BaseModel):
    block_ids: List[UUID]
