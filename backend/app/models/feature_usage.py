import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, BigInteger, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class FeatureUsage(Base):
    __tablename__ = "feature_usage"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="cascade"), nullable=False)
    feature = Column(String(50), nullable=False)
    usage_count = Column(BigInteger, default=0)
    period_start = Column(DateTime(timezone=True))
    period_end = Column(DateTime(timezone=True))

    __table_args__ = (UniqueConstraint("workspace_id", "feature", "period_start"),)

    workspace = relationship("Workspace", back_populates="feature_usage")
