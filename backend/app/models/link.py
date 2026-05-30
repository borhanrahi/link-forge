import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, BigInteger, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Link(Base):
    __tablename__ = "links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="cascade"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    original_url = Column(Text, nullable=False)
    short_code = Column(String(20), nullable=False, unique=True)
    custom_alias = Column(String(50), unique=True)
    title = Column(String(255))
    password_hash = Column(String(255))
    clicks_count = Column(BigInteger, default=0)
    unique_clicks_count = Column(BigInteger, default=0)
    is_active = Column(Boolean, default=True)
    is_cloaked = Column(Boolean, default=False)
    publish_at = Column(DateTime(timezone=True))
    position = Column(Integer, default=0)
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="links")
    user = relationship("User", back_populates="links")
    clicks = relationship("Click", back_populates="link", cascade="all, delete-orphan")
    qr_codes = relationship("QRCode", back_populates="link", cascade="all, delete-orphan")
    link_tags = relationship("LinkTag", back_populates="link", cascade="all, delete-orphan", lazy="noload")
    tags = relationship("Tag", secondary="link_tags", viewonly=True, lazy="noload")
    goal_alerts = relationship("ClickGoalAlert", back_populates="link", cascade="all, delete-orphan", lazy="noload")
