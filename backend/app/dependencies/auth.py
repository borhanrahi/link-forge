import hashlib
import hmac
import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.dependencies.db import get_db
from app.models.api_key import APIKey
from app.models.user import User

logger = logging.getLogger(__name__)
settings = get_settings()

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
_API_KEY_PREFIX = "ln_"
_API_KEY_MIN_SECRET_LEN = 24


def hash_password(password: str) -> str:
    return _pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return _pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def _hash_api_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()


def _looks_like_api_key(raw_key: str) -> bool:
    if not raw_key or not raw_key.startswith(_API_KEY_PREFIX):
        return False
    secret = raw_key[len(_API_KEY_PREFIX) :]
    return len(secret) >= _API_KEY_MIN_SECRET_LEN


def _is_dev_auth_bypass_allowed() -> bool:
    return bool(settings.dev_auth_bypass) and not settings.is_production


async def _validate_api_key(raw_key: str, db: AsyncSession) -> APIKey:
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
    if api_key.expires_at is not None and api_key.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key has expired",
        )

    return api_key


async def _get_user_from_api_key(
    request: Request, db: AsyncSession
) -> tuple[User, APIKey]:
    raw_key: Optional[str] = None

    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        candidate = auth_header[7:].strip()
        if _looks_like_api_key(candidate):
            raw_key = candidate

    if raw_key is None:
        x_api_key = request.headers.get("X-API-Key", "").strip()
        if _looks_like_api_key(x_api_key):
            raw_key = x_api_key

    if raw_key is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    api_key = await _validate_api_key(raw_key, db)

    result = await db.execute(select(User).where(User.id == api_key.user_id))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key owner not found or inactive",
        )

    try:
        api_key.last_used_at = datetime.now(timezone.utc)
        await db.commit()
    except Exception as exc:
        await db.rollback()
        logger.debug("Failed to update API key last_used_at: %s", exc)

    request.state.api_key = api_key
    return user, api_key


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    auth_header = request.headers.get("Authorization", "")
    x_api_key = request.headers.get("X-API-Key", "")

    if auth_header.startswith(f"Bearer {_API_KEY_PREFIX}") or x_api_key.startswith(
        _API_KEY_PREFIX
    ):
        user, _ = await _get_user_from_api_key(request, db)
        return user

    if _is_dev_auth_bypass_allowed():
        email = request.headers.get("X-User-Email")
        if email:
            from app.dependencies.neon_auth import _resolve_user_by_email

            user = await _resolve_user_by_email(db, email)
            if user and user.is_active:
                return user

    token = (
        auth_header[7:].strip()
        if auth_header.startswith("Bearer ")
        else None
    )
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    from app.dependencies.neon_auth import validate_neon_token

    payload = await validate_neon_token(token)
    email = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    from app.dependencies.neon_auth import _resolve_user_by_email

    user = await _resolve_user_by_email(db, email)
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
    try:
        return await get_current_user(request, db)
    except HTTPException:
        return None


def require_scope(required: str):
    async def _check(request: Request):
        api_key: Optional[APIKey] = getattr(request.state, "api_key", None)
        if api_key is None:
            return
        scopes = {s.strip() for s in (api_key.scopes or "").split(",") if s.strip()}
        if required not in scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"API key missing required scope: {required}",
            )

    return _check


def constant_time_eq(a: str, b: str) -> bool:
    return hmac.compare_digest(a.encode("utf-8"), b.encode("utf-8"))
