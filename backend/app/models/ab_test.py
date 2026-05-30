import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, BigInteger, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class ABTest(Base):
    __tablename__ = "ab_tests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="cascade"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="cascade"), nullable=False)
    name = Column(String(255), nullable=False)
    short_code = Column(String(20), nullable=False, unique=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="ab_tests")
    variants = relationship("ABTestVariant", back_populates="ab_test", cascade="all, delete-orphan")


class ABTestVariant(Base):
    __tablename__ = "ab_test_variants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ab_test_id = Column(UUID(as_uuid=True), ForeignKey("ab_tests.id", ondelete="cascade"), nullable=False)
    name = Column(String(100), nullable=False)
    url = Column(String(2048), nullable=False)
    weight = Column(Float, default=50.0)
    clicks_count = Column(BigInteger, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    ab_test = relationship("ABTest", back_populates="variants")
    clicks = relationship("Click", back_populates="ab_test_variant")
