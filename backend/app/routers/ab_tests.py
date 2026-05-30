import secrets
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.user import User
from app.models.workspace import Workspace
from app.models.ab_test import ABTest, ABTestVariant
from app.schemas.ab_test import ABTestCreate, ABTestResponse

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
