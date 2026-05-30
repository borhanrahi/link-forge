import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), nullable=False, unique=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plan = Column(String(20), default="free", nullable=False)
    branding_enabled = Column(Boolean, default=False)
    custom_colors_enabled = Column(Boolean, default=False)
    referral_code = Column(String(50), unique=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="owned_workspaces", foreign_keys=[owner_id])
    members = relationship("WorkspaceMember", back_populates="workspace", cascade="all, delete-orphan")
    links = relationship("Link", back_populates="workspace", cascade="all, delete-orphan")
    bio_pages = relationship("BioPage", back_populates="workspace", cascade="all, delete-orphan")
    custom_domains = relationship("CustomDomain", back_populates="workspace", cascade="all, delete-orphan")
    utm_presets = relationship("UTMPreset", back_populates="workspace", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="workspace", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="workspace", cascade="all, delete-orphan")
    feature_usage = relationship("FeatureUsage", back_populates="workspace", cascade="all, delete-orphan")
    tags = relationship("Tag", back_populates="workspace", cascade="all, delete-orphan")
    api_keys = relationship("APIKey", back_populates="workspace", cascade="all, delete-orphan")
    click_goal_alerts = relationship("ClickGoalAlert", back_populates="workspace", cascade="all, delete-orphan")
    ab_tests = relationship("ABTest", back_populates="workspace", cascade="all, delete-orphan")
