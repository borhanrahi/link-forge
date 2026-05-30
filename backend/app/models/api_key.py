import uuid
import secrets
import hashlib
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="cascade"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="cascade"), nullable=False)
    name = Column(String(255), nullable=False)
    key_hash = Column(String(64), nullable=False, unique=True)
    key_prefix = Column(String(10), nullable=False)
    scopes = Column(Text, default="read,write")
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="api_keys")
    user = relationship("User")

    @staticmethod
    def generate_key() -> tuple[str, str, str]:
        """Returns (raw_key, key_hash, key_prefix)"""
        raw = f"ln_{secrets.token_urlsafe(32)}"
        key_hash = hashlib.sha256(raw.encode()).hexdigest()
        key_prefix = raw[:10]
        return raw, key_hash, key_prefix
