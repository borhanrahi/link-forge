from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class APIKeyCreate(BaseModel):
    name: str
    scopes: str = "read,write"
    expires_at: Optional[datetime] = None


class APIKeyResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    user_id: UUID
    name: str
    key_prefix: str
    scopes: str
    is_active: bool
    last_used_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class APIKeyCreatedResponse(BaseModel):
    id: UUID
    name: str
    key: str
    key_prefix: str
    scopes: str
    created_at: Optional[datetime] = None
