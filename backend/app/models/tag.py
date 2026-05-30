import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="cascade"), nullable=False)
    name = Column(String(100), nullable=False)
    color = Column(String(7), default="#6366f1")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("workspace_id", "name"),)

    workspace = relationship("Workspace", back_populates="tags")


class LinkTag(Base):
    __tablename__ = "link_tags"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    link_id = Column(UUID(as_uuid=True), ForeignKey("links.id", ondelete="cascade"), nullable=False)
    tag_id = Column(UUID(as_uuid=True), ForeignKey("tags.id", ondelete="cascade"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("link_id", "tag_id"),)

    link = relationship("Link", back_populates="link_tags")
    tag = relationship("Tag")
