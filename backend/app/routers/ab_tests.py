import secrets
from datetime import datetime, timedelta
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, cast, Date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.user import User
from app.models.workspace import Workspace
from app.models.ab_test import ABTest, ABTestVariant
from app.models.click import Click
from app.schemas.ab_test import ABTestCreate, ABTestResponse, ABTestAnalyticsResponse, ABTestAnalyticsVariant
from app.schemas.analytics import TimeSeriesPoint

router = APIRouter(prefix="/ab-tests", tags=["ab-tests"])


def _generate_short_code() -> str:
    chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    return "".join(secrets.choice(chars) for _ in range(7))


@router.get("")
async def list_ab_tests(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ABTest)
        .options(selectinload(ABTest.variants))
        .where(ABTest.workspace_id == workspace.id)
        .order_by(ABTest.created_at.desc())
    )
    tests = result.scalars().all()
    return [ABTestResponse.model_validate(t) for t in tests]


@router.post("", status_code=201)
async def create_ab_test(
    body: ABTestCreate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    if len(body.variants) < 2:
        raise HTTPException(status_code=400, detail="At least 2 variants required")

    ab_test = ABTest(
        workspace_id=workspace.id,
        user_id=user.id,
        name=body.name,
        short_code=_generate_short_code(),
    )
    db.add(ab_test)
    await db.flush()

    for v in body.variants:
        variant = ABTestVariant(
            ab_test_id=ab_test.id,
            name=v.name,
            url=v.url,
            weight=v.weight,
        )
        db.add(variant)

    await db.commit()
    result = await db.execute(
        select(ABTest).options(selectinload(ABTest.variants)).where(ABTest.id == ab_test.id)
    )
    return ABTestResponse.model_validate(result.scalar_one())


@router.post("/{test_id}/toggle")
async def toggle_ab_test(
    test_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ABTest).where(ABTest.id == test_id, ABTest.workspace_id == workspace.id)
    )
    test = result.scalar_one_or_none()
    if not test:
        raise HTTPException(status_code=404, detail="A/B test not found")
    test.is_active = not test.is_active
    await db.commit()
    return {"is_active": test.is_active}


@router.get("/{test_id}")
async def get_ab_test(
    test_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ABTest)
        .options(selectinload(ABTest.variants))
        .where(ABTest.id == test_id, ABTest.workspace_id == workspace.id)
    )
    test = result.scalar_one_or_none()
    if not test:
        raise HTTPException(status_code=404, detail="A/B test not found")
    return ABTestResponse.model_validate(test)


@router.get("/{test_id}/analytics")
async def get_ab_test_analytics(
    test_id: UUID,
    range: str = Query("30d"),
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ABTest)
        .options(selectinload(ABTest.variants))
        .where(ABTest.id == test_id, ABTest.workspace_id == workspace.id)
    )
    test = result.scalar_one_or_none()
    if not test:
        raise HTTPException(status_code=404, detail="A/B test not found")

    now = datetime.utcnow()
    if range == "7d":
        start_date = now - timedelta(days=7)
    elif range == "30d":
        start_date = now - timedelta(days=30)
    elif range == "90d":
        start_date = now - timedelta(days=90)
    else:
        start_date = now - timedelta(days=30)

    variant_ids = [v.id for v in test.variants]
    total_clicks = sum(v.clicks_count or 0 for v in test.variants)

    variants_analytics = []
    for variant in test.variants:
        # Get timeseries for this variant
        timeseries_result = await db.execute(
            select(
                cast(Click.clicked_at, Date).label("date"),
                func.count().label("clicks"),
            )
            .where(
                Click.ab_test_variant_id == variant.id,
                Click.clicked_at >= start_date,
                Click.clicked_at <= now,
            )
            .group_by(cast(Click.clicked_at, Date))
            .order_by(cast(Click.clicked_at, Date))
        )
        ts_rows = timeseries_result.all()
        timeseries = [TimeSeriesPoint(date=str(r.date), clicks=r.clicks, unique_clicks=0) for r in ts_rows]

        pct = round((variant.clicks_count or 0) / total_clicks * 100, 1) if total_clicks > 0 else 0.0

        variants_analytics.append(
            ABTestAnalyticsVariant(
                id=variant.id,
                name=variant.name,
                url=variant.url,
                weight=variant.weight,
                clicks_count=variant.clicks_count or 0,
                percentage=pct,
                timeseries=timeseries,
            )
        )

    return ABTestAnalyticsResponse(
        test_id=test.id,
        test_name=test.name,
        is_active=test.is_active,
        short_code=test.short_code,
        total_clicks=total_clicks,
        variants=variants_analytics,
        created_at=test.created_at,
    )


@router.delete("/{test_id}")
async def delete_ab_test(
    test_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ABTest).where(ABTest.id == test_id, ABTest.workspace_id == workspace.id)
    )
    test = result.scalar_one_or_none()
    if not test:
        raise HTTPException(status_code=404, detail="A/B test not found")
    await db.delete(test)
    await db.commit()
    return {"message": "A/B test deleted"}
