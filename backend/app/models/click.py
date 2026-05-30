import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, BigInteger
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship

from sqlalchemy.orm import relationship

from app.database import Base


class Click(Base):
    __tablename__ = "clicks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    link_id = Column(UUID(as_uuid=True), ForeignKey("links.id", ondelete="cascade"), nullable=True)
    ab_test_variant_id = Column(UUID(as_uuid=True), ForeignKey("ab_test_variants.id", ondelete="set_null"), nullable=True)
    ip_address = Column(INET)
    ip_hash = Column(String(64))
    country_code = Column(String(2))
    city = Column(String(100))
    user_agent = Column(Text)
    device_type = Column(String(50))
    browser = Column(String(50))
    os = Column(String(50))
    referrer = Column(Text)
    utm_source = Column(String(100))
    utm_medium = Column(String(100))
    utm_campaign = Column(String(200))
    utm_content = Column(String(200))
    utm_term = Column(String(200))
    clicked_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    link = relationship("Link", back_populates="clicks")
    ab_test_variant = relationship("ABTestVariant", back_populates="clicks")
