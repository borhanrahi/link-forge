from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class QRCodeGenerate(BaseModel):
    color_fg: str = "#000000"
    color_bg: str = "#ffffff"
    logo_url: Optional[str] = None
    format: str = "png"


class QRCodeCreate(BaseModel):
    link_id: UUID
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


class QRCodeLinkInfo(BaseModel):
    title: Optional[str] = None
    short_code: str
    original_url: str


class QRCodeWithLinkResponse(BaseModel):
    id: UUID
    link_id: UUID
    color_fg: str
    color_bg: str
    logo_url: Optional[str] = None
    format: str
    scan_count: int
    created_at: datetime
    link: QRCodeLinkInfo

    model_config = {"from_attributes": True}

    @classmethod
    def from_qr_and_link(cls, qr: "QRCode", link: "Link") -> "QRCodeWithLinkResponse":
        return cls(
            id=qr.id,
            link_id=qr.link_id,
            color_fg=qr.color_fg,
            color_bg=qr.color_bg,
            logo_url=qr.logo_url,
            format=qr.format,
            scan_count=qr.scan_count,
            created_at=qr.created_at,
            link=QRCodeLinkInfo(
                title=link.title,
                short_code=link.short_code,
                original_url=link.original_url,
            ),
        )