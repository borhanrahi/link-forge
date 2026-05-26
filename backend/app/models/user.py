import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255))
    full_name = Column(String(255))
    avatar_url = Column(Text)
    email_verified = Column(Boolean, default=False)
    onboarding_completed = Column(Boolean, default=False)
    stripe_customer_id = Column(String(255))
    default_workspace_id = Column(UUID(as_uuid=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    owned_workspaces = relationship("Workspace", back_populates="owner", foreign_keys="Workspace.owner_id")
    workspace_memberships = relationship("WorkspaceMember", back_populates="user", foreign_keys="WorkspaceMember.user_id")
    links = relationship("Link", back_populates="user")
    bio_pages = relationship("BioPage", back_populates="user")
