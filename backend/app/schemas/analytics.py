from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class AnalyticsSummary(BaseModel):
    total_clicks: int = 0
    unique_clicks: int = 0
    total_links: int = 0
    top_country: Optional[str] = None
    top_device: Optional[str] = None
    top_browser: Optional[str] = None
    top_referrer: Optional[str] = None
    today_clicks: int = 0
    week_clicks: int = 0
    prev_week_clicks: int = 0
    prev_month_clicks: int = 0


class TimeSeriesPoint(BaseModel):
    date: str
    clicks: int
    unique_clicks: int


class GeoPoint(BaseModel):
    country_code: str
    country: str
    clicks: int


class DeviceBreakdown(BaseModel):
    device_type: str
    clicks: int
    percentage: float


class ReferrerBreakdown(BaseModel):
    referrer: str
    clicks: int
    percentage: float


class AnalyticsDashboard(BaseModel):
    summary: AnalyticsSummary
    timeseries: List[TimeSeriesPoint]
    geo: List[GeoPoint]
    devices: List[DeviceBreakdown]
    referrers: List[ReferrerBreakdown]
