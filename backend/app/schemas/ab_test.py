from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.schemas.analytics import TimeSeriesPoint


class ABTestVariantCreate(BaseModel):
    name: str
    url: str
    weight: float = 50.0


class ABTestCreate(BaseModel):
    name: str
    variants: List[ABTestVariantCreate]


class ABTestVariantResponse(BaseModel):
    id: UUID
    name: str
    url: str
    weight: float
    clicks_count: int

    model_config = {"from_attributes": True}


class ABTestResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    short_code: str
    is_active: bool
    variants: List[ABTestVariantResponse] = []
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ABTestAnalyticsVariant(BaseModel):
    id: UUID
    name: str
    url: str
    weight: float
    clicks_count: int
    percentage: float = 0.0
    timeseries: List[TimeSeriesPoint] = []


class ABTestAnalyticsResponse(BaseModel):
    test_id: UUID
    test_name: str
    is_active: bool
    short_code: str
    total_clicks: int
    variants: List[ABTestAnalyticsVariant] = []
    created_at: Optional[datetime] = None
