import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class BioPage(Base):
    __tablename__ = "bio_pages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="cascade"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    slug = Column(String(100), nullable=False, unique=True)
    title = Column(String(255))
    subtitle = Column(Text)
    profile_image_url = Column(Text)
    theme = Column(String(50), default="minimal")
    brand_color = Column(String(7), default="#000000")
    bg_color = Column(String(7), default="#ffffff")
    bg_image_url = Column(Text)
    font_family = Column(String(50), default="inter")
    meta_title = Column(String(255))
    meta_description = Column(Text)
    og_image_url = Column(Text)
    is_published = Column(Boolean, default=False)
    password_hash = Column(String(255))
    seo_indexable = Column(Boolean, default=True)
    clicks_count = Column(BigInteger, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="bio_pages")
    user = relationship("User", back_populates="bio_pages")
    blocks = relationship("BioBlock", back_populates="bio_page", cascade="all, delete-orphan")
