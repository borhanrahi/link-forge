import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class QRCode(Base):
    __tablename__ = "qr_codes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    link_id = Column(UUID(as_uuid=True), ForeignKey("links.id", ondelete="cascade"), nullable=False)
    color_fg = Column(String(7), default="#000000")
    color_bg = Column(String(7), default="#ffffff")
    logo_url = Column(Text)
    format = Column(String(10), default="png")
    file_path = Column(Text)
    scan_count = Column(BigInteger, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    link = relationship("Link", back_populates="qr_codes")
