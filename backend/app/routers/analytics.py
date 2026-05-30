import asyncio
from typing import Optional
from uuid import UUID
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select, func, cast, Date
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.link import Link
from app.models.click import Click
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.analytics import (
    AnalyticsSummary, TimeSeriesPoint, GeoPoint,
    DeviceBreakdown, ReferrerBreakdown, AnalyticsDashboard,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _get_date_range(range_type: str) -> tuple:
    now = datetime.utcnow()
    if range_type == "today":
        return now.replace(hour=0, minute=0, second=0, microsecond=0), now
    elif range_type == "7d":
        return now - timedelta(days=7), now
    elif range_type == "30d":
        return now - timedelta(days=30), now
    elif range_type == "90d":
        return now - timedelta(days=90), now
    return now - timedelta(days=30), now


@router.get("/dashboard")
async def dashboard(
    range: str = Query("30d"),
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    start_date, end_date = _get_date_range(range)
    now = datetime.utcnow()

    links_result = await db.execute(
        select(Link).where(Link.workspace_id == workspace.id)
    )
    links = links_result.scalars().all()
    link_ids = [l.id for l in links]

    if not link_ids:
        return AnalyticsDashboard(
            summary=AnalyticsSummary(),
            timeseries=[],
            geo=[],
            devices=[],
            referrers=[],
        )

    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = now - timedelta(days=7)
    prev_week_start = now - timedelta(days=14)
    prev_week_end = now - timedelta(days=7)
    prev_month_start = now - timedelta(days=60)
    prev_month_end = now - timedelta(days=30)

    async def count_clicks(since: datetime, until: datetime | None = None) -> int:
        q = select(func.count(Click.id)).where(
            Click.link_id.in_(link_ids),
            Click.clicked_at >= since,
        )
        if until:
            q = q.where(Click.clicked_at <= until)
        r = await db.execute(q)
        return r.scalar() or 0

    total_clicks, today_clicks, week_clicks, prev_week_clicks, prev_month_clicks = await asyncio.gather(
        count_clicks(start_date, end_date),
        count_clicks(today_start),
        count_clicks(week_start),
        count_clicks(prev_week_start, prev_week_end),
        count_clicks(prev_month_start, prev_month_end),
    )

    uniq = await db.execute(
        select(func.count(func.distinct(Click.ip_hash))).where(
            Click.link_id.in_(link_ids),
            Click.clicked_at >= start_date,
            Click.clicked_at <= end_date,
            Click.ip_hash.isnot(None),
        )
    )
    unique_clicks = uniq.scalar() or 0

    # Timeseries
    ts_result = await db.execute(
        select(
            cast(Click.clicked_at, Date).label("date"),
            func.count().label("clicks"),
        )
        .where(
            Click.link_id.in_(link_ids),
            Click.clicked_at >= start_date,
            Click.clicked_at <= end_date,
        )
        .group_by(cast(Click.clicked_at, Date))
        .order_by(cast(Click.clicked_at, Date))
    )
    timeseries = [TimeSeriesPoint(date=str(r.date), clicks=r.clicks, unique_clicks=0) for r in ts_result]

    # Geo
    geo_result = await db.execute(
        select(Click.country_code, func.count().label("cnt"))
        .where(
            Click.link_id.in_(link_ids),
            Click.clicked_at >= start_date,
            Click.clicked_at <= end_date,
            Click.country_code.isnot(None),
        )
        .group_by(Click.country_code)
        .order_by(func.count().desc())
        .limit(10)
    )
    geo = [GeoPoint(country_code=r.country_code, country=r.country_code, clicks=r.cnt) for r in geo_result]

    # Devices
    dev_result = await db.execute(
        select(Click.device_type, func.count().label("cnt"))
        .where(
            Click.link_id.in_(link_ids),
            Click.clicked_at >= start_date,
            Click.clicked_at <= end_date,
            Click.device_type.isnot(None),
        )
        .group_by(Click.device_type)
        .order_by(func.count().desc())
    )
    dev_rows = dev_result.all()
    dev_total = sum(r.cnt for r in dev_rows) or 1
    devices = [
        DeviceBreakdown(device_type=r.device_type, clicks=r.cnt, percentage=round(r.cnt / dev_total * 100, 1))
        for r in dev_rows
    ]

    # Referrers
    ref_result = await db.execute(
        select(Click.referrer, func.count().label("cnt"))
        .where(
            Click.link_id.in_(link_ids),
            Click.clicked_at >= start_date,
            Click.clicked_at <= end_date,
            Click.referrer.isnot(None),
        )
        .group_by(Click.referrer)
        .order_by(func.count().desc())
        .limit(10)
    )
    ref_rows = ref_result.all()
    ref_total = sum(r.cnt for r in ref_rows) or 1
    referrers = [
        ReferrerBreakdown(referrer=r.referrer or "direct", clicks=r.cnt, percentage=round(r.cnt / ref_total * 100, 1))
        for r in ref_rows
    ]

    # Top country
    tc = geo[0] if geo else None

    return AnalyticsDashboard(
        summary=AnalyticsSummary(
            total_clicks=total_clicks,
            unique_clicks=unique_clicks,
            total_links=len(links),
            top_country=tc.country_code if tc else None,
            today_clicks=today_clicks,
            week_clicks=week_clicks,
            prev_week_clicks=prev_week_clicks,
            prev_month_clicks=prev_month_clicks,
        ),
        timeseries=timeseries,
        geo=geo,
        devices=devices,
        referrers=referrers,
    )


@router.get("/sparklines")
async def sparklines(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    from collections import defaultdict
    now = datetime.utcnow()
    start_date = now - timedelta(days=6)

    result = await db.execute(
        select(Link.id).where(Link.workspace_id == workspace.id)
    )
    link_ids = [r[0] for r in result.all()]

    if not link_ids:
        return {}

    rows = await db.execute(
        select(
            Click.link_id,
            cast(Click.clicked_at, Date).label("date"),
            func.count().label("clicks"),
        )
        .where(
            Click.link_id.in_(link_ids),
            Click.clicked_at >= start_date,
        )
        .group_by(Click.link_id, cast(Click.clicked_at, Date))
        .order_by(cast(Click.clicked_at, Date))
    )

    data = defaultdict(dict)
    for row in rows:
        data[str(row.link_id)][str(row.date)] = row.clicks

    result_map = {}
    for lid in link_ids:
        sid = str(lid)
        points = []
        for i in range(6, -1, -1):
            day = (now - timedelta(days=i)).strftime("%Y-%m-%d")
            points.append(data[sid].get(day, 0))
        result_map[sid] = points

    return result_map


@router.get("/export")
async def export_csv(
    link_id: Optional[UUID] = Query(None),
    range: str = Query("30d"),
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    import csv, io

    start_date, end_date = _get_date_range(range)

    # Get workspace link IDs for scoping
    links_result = await db.execute(
        select(Link.id).where(Link.workspace_id == workspace.id)
    )
    link_ids = [r[0] for r in links_result.all()]

    query = select(Click).where(
        Click.link_id.in_(link_ids),
        Click.clicked_at >= start_date,
        Click.clicked_at <= end_date,
    )
    if link_id:
        query = query.where(Click.link_id == link_id)
    query = query.order_by(Click.clicked_at.desc())

    result = await db.execute(query)
    clicks = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["clicked_at", "country", "city", "device", "browser", "os", "referrer", "utm_source", "utm_medium", "utm_campaign"])
    for c in clicks:
        writer.writerow([c.clicked_at, c.country_code, c.city, c.device_type, c.browser, c.os, c.referrer, c.utm_source, c.utm_medium, c.utm_campaign])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=clicks.csv"},
    )


@router.get("/{link_id}")
async def link_analytics(
    link_id: UUID,
    range: str = Query("30d"),
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    start_date, end_date = _get_date_range(range)
    now = datetime.utcnow()

    # Verify link belongs to workspace
    link_result = await db.execute(
        select(Link).where(Link.id == link_id, Link.workspace_id == workspace.id)
    )
    link = link_result.scalar_one_or_none()
    if not link:
        return {"link_id": str(link_id), "total_clicks": 0, "range": range, "timeseries": [], "geo": [], "devices": [], "referrers": []}

    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = now - timedelta(days=7)
    prev_week_start = now - timedelta(days=14)
    prev_week_end = now - timedelta(days=7)

    total, today_c, week_c, prev_week_c = await asyncio.gather(
        _count_link_clicks(db, link_id, start_date, end_date),
        _count_link_clicks(db, link_id, today_start),
        _count_link_clicks(db, link_id, week_start),
        _count_link_clicks(db, link_id, prev_week_start, prev_week_end),
    )

    uniq = await db.execute(
        select(func.count(func.distinct(Click.ip_hash))).where(
            Click.link_id == link_id,
            Click.clicked_at >= start_date,
            Click.clicked_at <= end_date,
            Click.ip_hash.isnot(None),
        )
    )
    unique_clicks = uniq.scalar() or 0

    # Timeseries
    ts_result = await db.execute(
        select(
            cast(Click.clicked_at, Date).label("date"),
            func.count().label("clicks"),
        )
        .where(
            Click.link_id == link_id,
            Click.clicked_at >= start_date,
            Click.clicked_at <= end_date,
        )
        .group_by(cast(Click.clicked_at, Date))
        .order_by(cast(Click.clicked_at, Date))
    )
    timeseries = [TimeSeriesPoint(date=str(r.date), clicks=r.clicks, unique_clicks=0) for r in ts_result]

    # Geo
    geo_result = await db.execute(
        select(Click.country_code, func.count().label("cnt"))
        .where(
            Click.link_id == link_id,
            Click.clicked_at >= start_date,
            Click.clicked_at <= end_date,
            Click.country_code.isnot(None),
        )
        .group_by(Click.country_code)
        .order_by(func.count().desc())
        .limit(10)
    )
    geo = [GeoPoint(country_code=r.country_code, country=r.country_code, clicks=r.cnt) for r in geo_result]

    # Devices
    dev_result = await db.execute(
        select(Click.device_type, func.count().label("cnt"))
        .where(
            Click.link_id == link_id,
            Click.clicked_at >= start_date,
            Click.clicked_at <= end_date,
            Click.device_type.isnot(None),
        )
        .group_by(Click.device_type)
        .order_by(func.count().desc())
    )
    dev_rows = dev_result.all()
    dev_total = sum(r.cnt for r in dev_rows) or 1
    devices = [
        DeviceBreakdown(device_type=r.device_type, clicks=r.cnt, percentage=round(r.cnt / dev_total * 100, 1))
        for r in dev_rows
    ]

    # Referrers
    ref_result = await db.execute(
        select(Click.referrer, func.count().label("cnt"))
        .where(
            Click.link_id == link_id,
            Click.clicked_at >= start_date,
            Click.clicked_at <= end_date,
            Click.referrer.isnot(None),
        )
        .group_by(Click.referrer)
        .order_by(func.count().desc())
        .limit(10)
    )
    ref_rows = ref_result.all()
    ref_total = sum(r.cnt for r in ref_rows) or 1
    referrers = [
        ReferrerBreakdown(referrer=r.referrer or "direct", clicks=r.cnt, percentage=round(r.cnt / ref_total * 100, 1))
        for r in ref_rows
    ]

    return {
        "link_id": str(link_id),
        "total_clicks": total,
        "unique_clicks": unique_clicks,
        "today_clicks": today_c,
        "week_clicks": week_c,
        "prev_week_clicks": prev_week_c,
        "range": range,
        "timeseries": [t.model_dump() for t in timeseries],
        "geo": [g.model_dump() for g in geo],
        "devices": [d.model_dump() for d in devices],
        "referrers": [r.model_dump() for r in referrers],
    }


async def _count_link_clicks(db, link_id, since, until=None):
    q = select(func.count(Click.id)).where(Click.link_id == link_id, Click.clicked_at >= since)
    if until:
        q = q.where(Click.clicked_at <= until)
    r = await db.execute(q)
    return r.scalar() or 0
