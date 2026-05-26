"""
Neon Auth JWT validation using JWKS.
Validates tokens issued by Neon Auth (Better Auth-based) via the JWKS endpoint.
"""

import base64
import json
import time
from typing import Optional, Dict, Any

import httpx
from fastapi import Depends, HTTPException, status, Request
from jose import jwk, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.dependencies.db import get_db
from app.models.user import User

settings = get_settings()


def _decode_jwt_payload(token: str) -> dict:
    """Decode JWT payload WITHOUT signature verification.
    Only safe for local/dev use where JWKS is unavailable.
    """
    parts = token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid JWT format")
    # Base64url decode the payload (middle part)
    payload_b64 = parts[1]
    # Add padding if needed
    padding = 4 - len(payload_b64) % 4
    if padding != 4:
        payload_b64 += "=" * padding
    try:
        decoded = base64.urlsafe_b64decode(payload_b64)
        return json.loads(decoded)
    except Exception as e:
        raise ValueError(f"Failed to decode JWT payload: {e}")


def _dev_auth_bypass(token: str) -> dict:
    """Dev bypass: decode JWT payload without signature verification."""
    try:
        return _decode_jwt_payload(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Dev auth bypass failed to decode token: {e}",
        )

# ─── JWKS Cache ──────────────────────────────────────────────
_jwks_cache: Optional[Dict[str, Any]] = None
_jwks_cache_time: float = 0
JWKS_CACHE_TTL = 3600  # 1 hour


async def fetch_jwks() -> Dict[str, Any]:
    """Fetch the JWKS from Neon Auth."""
    global _jwks_cache, _jwks_cache_time

    now = time.time()
    if _jwks_cache and (now - _jwks_cache_time) < JWKS_CACHE_TTL:
        return _jwks_cache

    jwks_url = f"{settings.neon_auth_url}/jwks"
    async with httpx.AsyncClient() as client:
        resp = await client.get(jwks_url, timeout=10)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        _jwks_cache_time = now
        return _jwks_cache


async def validate_neon_token(token: str) -> dict:
    """Validate a Neon Auth JWT and return the payload."""
    # Try JWKS validation first
    try:
        jwks_data = await fetch_jwks()
    except Exception as e:
        if settings.dev_auth_bypass:
            return _dev_auth_bypass(token)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Failed to fetch auth keys: {e}",
        )

    keys = jwks_data.get("keys", [])
    if not keys:
        if settings.dev_auth_bypass:
            return _dev_auth_bypass(token)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No JWKS keys available",
        )

    # Try each key until one works
    last_error = None
    for key_data in keys:
        try:
            rsa_key = jwk.RSAKey.import_key(key_data)
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                options={"verify_aud": False},
            )
            return payload
        except Exception as e:
            last_error = e
            continue

    if settings.dev_auth_bypass:
        return _dev_auth_bypass(token)

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Invalid token: {last_error}",
    )


async def get_token_from_request(request: Request) -> Optional[str]:
    """Extract the Bearer token from the Authorization header."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get the current authenticated user from a Neon Auth JWT."""
    token = await get_token_from_request(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = await validate_neon_token(token)

    # Extract user info from token
    email = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    # Look up user in our DB by email
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
