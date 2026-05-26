from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class WorkspaceCreate(BaseModel):
    name: str


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    branding_enabled: Optional[bool] = None
    custom_colors_enabled: Optional[bool] = None


class WorkspaceResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    owner_id: UUID
    plan: str
    branding_enabled: bool
    custom_colors_enabled: bool
    member_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class MemberResponse(BaseModel):
    id: UUID
    user_id: UUID
    email: str = ""
    full_name: str = ""
    role: str
    invite_status: str
    joined_at: datetime

    model_config = {"from_attributes": True}


class InviteRequest(BaseModel):
    email: str
    role: str = "member"


class MemberRoleUpdate(BaseModel):
    role: str
