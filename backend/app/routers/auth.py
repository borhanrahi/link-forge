from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_db
from app.dependencies.neon_auth import get_current_user
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.auth import NeonCallbackRequest
from app.schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/neon-callback", status_code=201)
async def neon_callback(
    body: NeonCallbackRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Callback after Neon Auth authentication.
    Creates a local user if they don't exist, otherwise returns existing user.
    """
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if user:
        return UserResponse.model_validate(user)

    # Create new user
    display_name = body.name or body.email.split("@")[0]
    user = User(
        email=body.email,
        full_name=display_name,
        password_hash="",  # Password managed by Neon Auth
    )
    db.add(user)
    await db.flush()

    workspace = Workspace(
        name=f"{display_name}'s Workspace",
        slug=body.email.split("@")[0][:50],
        owner_id=user.id,
    )
    db.add(workspace)
    await db.flush()

    user.default_workspace_id = workspace.id
    await db.commit()

    return UserResponse.model_validate(user)


@router.post("/logout")
async def logout(user: User = Depends(get_current_user)):
    return {"message": "Logged out"}
