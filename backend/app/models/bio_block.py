import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, BigInteger, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class BioBlock(Base):
    __tablename__ = "bio_blocks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bio_page_id = Column(UUID(as_uuid=True), ForeignKey("bio_pages.id", ondelete="cascade"), nullable=False)
    block_type = Column(String(50), nullable=False)
    label = Column(String(255))
    url = Column(Text)
    icon = Column(String(50))
    image_url = Column(Text)
    video_url = Column(Text)
    embed_html = Column(Text)
    position = Column(Integer, nullable=False, default=0)
    visible_from = Column(DateTime(timezone=True))
    visible_until = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    click_tracking_enabled = Column(Boolean, default=True)
    clicks_count = Column(BigInteger, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    bio_page = relationship("BioPage", back_populates="blocks")
