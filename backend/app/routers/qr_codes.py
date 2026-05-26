from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_user, get_db
from app.dependencies.workspace import get_active_workspace
from app.models.link import Link
from app.models.qr_code import QRCode
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.qr_code import QRCodeGenerate, QRCodeResponse
from app.services.qr_generator import generate_qr

router = APIRouter(prefix="/qr", tags=["qr-codes"])


@router.get("/{link_id}")
async def download_qr(
    link_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(QRCode).where(QRCode.link_id == link_id))
    qr = result.scalar_one_or_none()
    if not qr:
        raise HTTPException(status_code=404, detail="QR code not found")

    link_result = await db.execute(select(Link).where(Link.id == link_id))
    link = link_result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    short_url = f"/{link.short_code}"
    qr_bytes = generate_qr(short_url, qr.color_fg, qr.color_bg)

    return Response(content=qr_bytes, media_type="image/png",
                    headers={"Content-Disposition": f"attachment; filename=qr-{link.short_code}.png"})


@router.post("/{link_id}/regenerate")
async def regenerate_qr(
    link_id: UUID,
    body: QRCodeGenerate,
    user: User = Depends(get_current_user),
    workspace: Workspace = Depends(get_active_workspace),
    db: AsyncSession = Depends(get_db),
):
    link_result = await db.execute(
        select(Link).where(Link.id == link_id, Link.workspace_id == workspace.id)
    )
    link = link_result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    qr_result = await db.execute(select(QRCode).where(QRCode.link_id == link_id))
    qr = qr_result.scalar_one_or_none()
    if qr:
        qr.color_fg = body.color_fg
        qr.color_bg = body.color_bg
        qr.logo_url = body.logo_url
        qr.format = body.format
    else:
        qr = QRCode(link_id=link_id, color_fg=body.color_fg, color_bg=body.color_bg, logo_url=body.logo_url, format=body.format)
        db.add(qr)
    await db.commit()
    return QRCodeResponse.model_validate(qr)
