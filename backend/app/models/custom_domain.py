import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class CustomDomain(Base):
    __tablename__ = "custom_domains"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="cascade"), nullable=False)
    domain = Column(String(255), nullable=False, unique=True)
    status = Column(String(20), default="pending")
    verification_txt = Column(String(255))
    ssl_active = Column(Boolean, default=False)
    default_bio_page_id = Column(UUID(as_uuid=True), ForeignKey("bio_pages.id", ondelete="set null"))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="custom_domains")
