from typing import Dict, Optional
from uuid import UUID
from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.feature_usage import FeatureUsage
from app.models.workspace import Workspace


FEATURE_LIMITS = {
    "free": {
        "links": 10,
        "bio_pages": 1,
        "custom_domains": 0,
        "team_members": 1,
    },
    "pro": {
        "links": None,
        "bio_pages": 3,
        "custom_domains": 1,
        "team_members": 1,
    },
    "business": {
        "links": None,
        "bio_pages": None,
        "custom_domains": 5,
        "team_members": 10,
    },
}


async def check_feature_limit(
    db: AsyncSession,
    workspace_id: UUID,
    feature: str,
) -> bool:
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id))
    ws = result.scalar_one_or_none()
    if not ws:
        return False

    plan = ws.plan
    limits = FEATURE_LIMITS.get(plan, {})
    limit = limits.get(feature)

    if limit is None:
        return True

    now = datetime.utcnow()
    period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    usage_result = await db.execute(
        select(FeatureUsage).where(
            FeatureUsage.workspace_id == workspace_id,
            FeatureUsage.feature == feature,
            FeatureUsage.period_start == period_start,
        )
    )
    usage = usage_result.scalar_one_or_none()

    if usage and usage.usage_count >= limit:
        return False

    return True


async def increment_feature_usage(
    db: AsyncSession,
    workspace_id: UUID,
    feature: str,
) -> None:
    now = datetime.utcnow()
    period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    period_end = (period_start + timedelta(days=32)).replace(day=1)

    result = await db.execute(
        select(FeatureUsage).where(
            FeatureUsage.workspace_id == workspace_id,
            FeatureUsage.feature == feature,
            FeatureUsage.period_start == period_start,
        )
    )
    usage = result.scalar_one_or_none()

    if usage:
        usage.usage_count = usage.usage_count + 1
    else:
        usage = FeatureUsage(
            workspace_id=workspace_id,
            feature=feature,
            usage_count=1,
            period_start=period_start,
            period_end=period_end,
        )
        db.add(usage)
    await db.commit()
