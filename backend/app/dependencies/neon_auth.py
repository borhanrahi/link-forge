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
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import jwt as pyjwt
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

from app.config import get_settings
from app.dependencies.db import get_db
from app.models.user import User

settings = get_settings()


def _decode_jwt_payload(token: str) -> dict:
    parts = token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid JWT format")
    payload_b64 = parts[1]
    padding = 4 - len(payload_b64) % 4
    if padding != 4:
        payload_b64 += "=" * padding
    try:
        decoded = base64.urlsafe_b64decode(payload_b64)
        return json.loads(decoded)
    except Exception as e:
        raise ValueError(f"Failed to decode JWT payload: {e}")


def _dev_auth_bypass(token: str) -> dict:
    try:
        return _decode_jwt_payload(token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Dev auth bypass failed to decode token: {e}",
        )

_jwks_cache: Optional[Dict[str, Any]] = None
_jwks_cache_time: float = 0
JWKS_CACHE_TTL = 3600


def _jwk_to_public_key(key_data: dict):
    kty = key_data.get("kty")
    if kty == "OKP" and key_data.get("crv") == "Ed25519":
        x_bytes = base64.urlsafe_b64decode(key_data["x"] + "==")
        return Ed25519PublicKey.from_public_bytes(x_bytes)
    raise ValueError(f"Unsupported key type: {kty}")


async def fetch_jwks() -> Dict[str, Any]:
    global _jwks_cache, _jwks_cache_time
    now = time.time()
    if _jwks_cache and (now - _jwks_cache_time) < JWKS_CACHE_TTL:
        return _jwks_cache

    jwks_url = f"{settings.neon_auth_url}/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        resp = await client.get(jwks_url, timeout=10)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        _jwks_cache_time = now
        return _jwks_cache


async def validate_neon_token(token: str) -> dict:
    last_error = None

    # Try JWKS validation (works with real JWTs like Neon Auth API keys)
    try:
        jwks_data = await fetch_jwks()
        for key_data in jwks_data.get("keys", []):
            try:
                public_key = _jwk_to_public_key(key_data)
                payload = pyjwt.decode(
                    token, public_key, algorithms=["EdDSA"],
                    options={"verify_aud": False},
                )
                return payload
            except Exception as e:
                last_error = e
                continue
    except Exception as e:
        last_error = e

    if settings.dev_auth_bypass:
        try:
            return _dev_auth_bypass(token)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session. Try logging out and back in.",
            )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Invalid token: {last_error}",
    )


async def get_token_from_request(request: Request) -> Optional[str]:
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> User:
    # Dev bypass: trust email from X-User-Email header
    if settings.dev_auth_bypass:
        email = request.headers.get("X-User-Email")
        if email:
            result = await db.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()
            if user:
                return user

    token = await get_token_from_request(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

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
    try:
        return await get_current_user(request, db)
    except HTTPException:
        return None
