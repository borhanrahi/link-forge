from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class CustomDomainCreate(BaseModel):
    domain: str


class CustomDomainResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    domain: str
    status: str
    verification_txt: Optional[str] = None
    ssl_active: bool
    default_bio_page_id: Optional[UUID] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class DomainVerifyResponse(BaseModel):
    domain: str
    status: str
    verified: bool
    message: str
