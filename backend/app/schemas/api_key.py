from pydantic import BaseModel, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime

VALID_SCOPES = {"read", "write", "delete", "admin"}


class APIKeyCreate(BaseModel):
    name: str
    scopes: str = "read,write"
    expires_at: Optional[datetime] = None

    @field_validator("scopes")
    @classmethod
    def validate_scopes(cls, v: str) -> str:
        parts = [s.strip() for s in v.split(",")]
        invalid = set(parts) - VALID_SCOPES
        if invalid:
            raise ValueError(f"Invalid scopes: {', '.join(invalid)}. Valid: {', '.join(sorted(VALID_SCOPES))}")
        return ",".join(parts)


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
