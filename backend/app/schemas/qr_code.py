from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class QRCodeGenerate(BaseModel):
    color_fg: str = "#000000"
    color_bg: str = "#ffffff"
    logo_url: Optional[str] = None
    format: str = "png"


class QRCodeResponse(BaseModel):
    id: UUID
    link_id: UUID
    color_fg: str
    color_bg: str
    logo_url: Optional[str] = None
    format: str
    scan_count: int
    created_at: datetime

    model_config = {"from_attributes": True}
