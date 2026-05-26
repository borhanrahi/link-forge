from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class BioPageCreate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    slug: str
    theme: str = "minimal"
    brand_color: str = "#000000"
    bg_color: str = "#ffffff"
    font_family: str = "inter"


class BioPageUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    slug: Optional[str] = None
    profile_image_url: Optional[str] = None
    theme: Optional[str] = None
    brand_color: Optional[str] = None
    bg_color: Optional[str] = None
    bg_image_url: Optional[str] = None
    font_family: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image_url: Optional[str] = None
    password: Optional[str] = None
    seo_indexable: Optional[bool] = None


class BioPageResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    user_id: UUID
    slug: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    profile_image_url: Optional[str] = None
    theme: str
    brand_color: str
    bg_color: str
    bg_image_url: Optional[str] = None
    font_family: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    og_image_url: Optional[str] = None
    is_published: bool
    seo_indexable: bool
    clicks_count: int
    blocks: List["BioBlockResponse"] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BioPagePublic(BaseModel):
    id: UUID
    slug: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    profile_image_url: Optional[str] = None
    theme: str
    brand_color: str
    bg_color: str
    bg_image_url: Optional[str] = None
    font_family: str
    blocks: List["BioBlockResponse"] = []

    model_config = {"from_attributes": True}
