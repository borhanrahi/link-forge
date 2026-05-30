import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class ClickGoalAlert(Base):
    __tablename__ = "click_goal_alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="cascade"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="cascade"), nullable=False)
    link_id = Column(UUID(as_uuid=True), ForeignKey("links.id", ondelete="cascade"), nullable=False)
    goal_clicks = Column(BigInteger, nullable=False)
    is_achieved = Column(Boolean, default=False)
    achieved_at = Column(DateTime(timezone=True))
    notify_email = Column(Boolean, default=True)
    notify_dashboard = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    workspace = relationship("Workspace", back_populates="click_goal_alerts")
    link = relationship("Link", back_populates="goal_alerts")
