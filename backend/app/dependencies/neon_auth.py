"""
Neon Auth JWT validation using JWKS.
Validates tokens issued by Neon Auth (Better Auth-based) via the JWKS endpoint.
"""

import base64
import json
import logging
import time
from typing import Any, Dict, Optional

import httpx
import jwt as pyjwt
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.dependencies.db import get_db
from app.models.user import User

logger = logging.getLogger(__name__)
settings = get_settings()


def _b64url_decode(data: str) -> bytes:
    padding = 4 - len(data) % 4
    return base64.urlsafe_b64decode(data + ("=" * padding if padding != 4 else ""))


def _decode_jwt_payload(token: str) -> dict:
    parts = token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid JWT format")
    try:
        return json.loads(_b64url_decode(parts[1]))
    except Exception as exc:
        raise ValueError(f"Failed to decode JWT payload: {exc}") from exc


_jwks_cache: Optional[Dict[str, Any]] = None
_jwks_cache_time: float = 0.0
JWKS_CACHE_TTL = 3600
_CLOCK_SKEW_SECONDS = 30


def _jwk_to_public_key(key_data: dict):
    kty = key_data.get("kty")
    if kty == "OKP" and key_data.get("crv") == "Ed25519":
        return Ed25519PublicKey.from_public_bytes(_b64url_decode(key_data["x"]))
    raise ValueError(f"Unsupported key type: {kty}")


def _expected_issuer() -> Optional[str]:
    if not settings.neon_auth_url:
        return None
    return settings.neon_auth_url.rstrip("/")


async def _fetch_jwks(force: bool = False) -> Dict[str, Any]:
    global _jwks_cache, _jwks_cache_time
    now = time.time()
    if not force and _jwks_cache and (now - _jwks_cache_time) < JWKS_CACHE_TTL:
        return _jwks_cache

    if not settings.neon_auth_url:
        raise RuntimeError("NEON_AUTH_URL is not configured")

    jwks_url = f"{settings.neon_auth_url.rstrip('/')}/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        resp = await client.get(jwks_url, timeout=10)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        _jwks_cache_time = now
        return _jwks_cache


async def validate_neon_token(token: str) -> dict:
    last_error: Optional[Exception] = None

    decode_options = {
        "verify_signature": True,
        "verify_exp": True,
        "verify_iat": True,
        "verify_nbf": True,
    }

    try:
        jwks_data = await _fetch_jwks()
        unverified_header = pyjwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        matching_keys = (
            [k for k in jwks_data.get("keys", []) if k.get("kid") == kid]
            if kid
            else list(jwks_data.get("keys", []))
        )
        for key_data in matching_keys or jwks_data.get("keys", []):
            try:
                public_key = _jwk_to_public_key(key_data)
                payload = pyjwt.decode(
                    token,
                    public_key,
                    algorithms=["EdDSA"],
                    audience=settings.neon_auth_audience or None,
                    issuer=_expected_issuer(),
                    leeway=_CLOCK_SKEW_SECONDS,
                    options=decode_options,
                )
                return payload
            except pyjwt.PyJWTError as exc:
                last_error = exc
                continue
    except (httpx.HTTPError, RuntimeError) as exc:
        last_error = exc

    if settings.dev_auth_bypass and not settings.is_production:
        try:
            return _decode_jwt_payload(token)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session. Try logging out and back in.",
            )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=(
            "Invalid token"
            if last_error is None
            else f"Invalid token: {last_error}"
        ),
    )


async def get_token_from_request(request: Request) -> Optional[str]:
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None


async def _resolve_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    if not email or "@" not in email:
        return None
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    if settings.dev_auth_bypass and not settings.is_production:
        email = request.headers.get("X-User-Email")
        if email:
            user = await _resolve_user_by_email(db, email)
            if user and user.is_active:
                return user

    token = await get_token_from_request(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = await validate_neon_token(token)
    email = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

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
