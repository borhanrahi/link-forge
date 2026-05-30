from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class TagCreate(BaseModel):
    name: str
    color: str = "#6366f1"


class TagUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None


class TagResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    color: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class LinkTagRequest(BaseModel):
    tag_ids: List[UUID]
