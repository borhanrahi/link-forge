from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.custom_domain import CustomDomain
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.custom_domain import CustomDomainCreate, CustomDomainResponse, DomainVerifyResponse
from app.services.domain_validator import verify_domain_ownership
from app.services.quota_enforcer import check_feature_limit, increment_feature_usage

router = APIRouter(prefix="/domains", tags=["domains"])


@router.get("")
async def list_domains(
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CustomDomain).where(CustomDomain.workspace_id == workspace.id)
    )
    domains = result.scalars().all()
    return [CustomDomainResponse.model_validate(d) for d in domains]


@router.post("", status_code=201)
async def add_domain(
    body: CustomDomainCreate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    if not await check_feature_limit(db, workspace.id, "custom_domains"):
        raise HTTPException(status_code=403, detail="Custom domain limit reached")

    existing = await db.execute(select(CustomDomain).where(CustomDomain.domain == body.domain))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Domain already added")

    domain = CustomDomain(
        workspace_id=workspace.id,
        domain=body.domain,
        verification_txt=f"linknest-verify-{workspace.id.hex[:8]}",
    )
    db.add(domain)
    await increment_feature_usage(db, workspace.id, "custom_domains")
    await db.commit()
    return CustomDomainResponse.model_validate(domain)


@router.get("/{domain_id}/verify")
async def verify_domain(
    domain_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    verified = await verify_domain_ownership(db, str(domain_id))
    if verified:
        return DomainVerifyResponse(domain="", status="verified", verified=True, message="Domain verified")
    return DomainVerifyResponse(domain="", status="pending", verified=False, message="DNS verification failed. Add TXT record and try again.")


@router.delete("/{domain_id}")
async def remove_domain(
    domain_id: UUID,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CustomDomain).where(CustomDomain.id == domain_id, CustomDomain.workspace_id == workspace.id)
    )
    domain = result.scalar_one_or_none()
    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")
    await db.delete(domain)
    await db.commit()
    return {"message": "Domain removed"}
