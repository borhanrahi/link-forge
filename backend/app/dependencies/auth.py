import hashlib
from datetime import datetime, timezone
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_db
from app.models.user import User
from app.models.api_key import APIKey
from app.dependencies.neon_auth import (
    get_current_user as neon_get_current_user,
    get_optional_user as neon_get_optional_user,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _hash_api_key(raw_key: str) -> str:
    """Hash an API key using SHA-256 for lookup."""
    return hashlib.sha256(raw_key.encode()).hexdigest()


async def _validate_api_key(raw_key: str, db: AsyncSession) -> APIKey:
    """Validate an API key and return the APIKey record.
    
    Checks:
    - Key exists in database
    - Key is active (not revoked)
    - Key has not expired
    """
    key_hash = _hash_api_key(raw_key)

    result = await db.execute(
        select(APIKey).where(APIKey.key_hash == key_hash)
    )
    api_key = result.scalar_one_or_none()

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )

    if not api_key.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key has been revoked",
        )

    if api_key.expires_at and api_key.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key has expired",
        )

    return api_key


async def _get_user_from_api_key(request: Request, db: AsyncSession) -> tuple[User, APIKey]:
    """Authenticate via API key. Returns (user, api_key).
    
    Accepts API key from:
    - Authorization: Bearer ln_*...
    - X-API-Key: ln_*...
    """
    # Check Authorization header for ln_* prefix
    auth_header = request.headers.get("Authorization", "")
    raw_key = None

    if auth_header.startswith("Bearer ln_"):
        raw_key = auth_header[7:]
    else:
        # Fallback to X-API-Key header
        x_api_key = request.headers.get("X-API-Key", "")
        if x_api_key.startswith("ln_"):
            raw_key = x_api_key

    if not raw_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    api_key = await _validate_api_key(raw_key, db)

    # Fetch the user who owns this key
    result = await db.execute(select(User).where(User.id == api_key.user_id))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key owner not found or inactive",
        )

    # Update last_used_at (fire-and-forget, don't fail auth on error)
    try:
        api_key.last_used_at = datetime.now(timezone.utc)
        await db.commit()
    except Exception:
        await db.rollback()

    # Store API key on request.state for workspace resolution
    request.state.api_key = api_key

    return user, api_key


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get the current authenticated user.
    
    Supports two authentication methods:
    1. API key: Authorization: Bearer ln_*... or X-API-Key: ln_*
    2. JWT: Authorization: Bearer <neon_jwt>
    
    API key is checked first.
    """
    auth_header = request.headers.get("Authorization", "")
    x_api_key = request.headers.get("X-API-Key", "")

    # Detect API key authentication
    if auth_header.startswith("Bearer ln_") or x_api_key.startswith("ln_"):
        user, _ = await _get_user_from_api_key(request, db)
        return user

    # Dev bypass: trust email from X-User-Email header
    from app.config import get_settings
    settings = get_settings()
    if settings.dev_auth_bypass:
        email = request.headers.get("X-User-Email")
        if email:
            result = await db.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()
            if user:
                return user

    # Fall back to JWT authentication
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    from app.dependencies.neon_auth import validate_neon_token
    payload = await validate_neon_token(token)

    email = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    return user


async def get_optional_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """Get the current user, or None if not authenticated."""
    try:
        return await get_current_user(request, db)
    except HTTPException:
        return None


def require_scope(required: str):
    """Dependency factory that checks if the current API key has the required scope.
    
    Usage:
        @router.get("/links", dependencies=[Depends(require_scope("read"))])
    """
    async def _check(request: Request):
        api_key: Optional[APIKey] = getattr(request.state, "api_key", None)
        if api_key is None:
            # JWT auth — no scope restrictions
            return
        scopes = [s.strip() for s in (api_key.scopes or "").split(",")]
        if required not in scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"API key missing required scope: {required}",
            )
    return _check
