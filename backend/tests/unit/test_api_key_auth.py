"""Tests for API key authentication."""
import hashlib
import secrets
from datetime import datetime, timezone, timedelta
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import _hash_api_key, _validate_api_key, get_current_user, require_scope
from app.models.api_key import APIKey
from app.models.user import User


def _make_raw_key() -> str:
    return f"ln_{secrets.token_urlsafe(32)}"


def _make_api_key(raw_key: str, **overrides) -> APIKey:
    key = MagicMock(spec=APIKey)
    key.id = overrides.get("id", "test-key-id")
    key.key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    key.key_prefix = raw_key[:10]
    key.is_active = overrides.get("is_active", True)
    key.scopes = overrides.get("scopes", "read,write")
    key.expires_at = overrides.get("expires_at", None)
    key.last_used_at = overrides.get("last_used_at", None)
    key.user_id = overrides.get("user_id", "test-user-id")
    key.workspace_id = overrides.get("workspace_id", "test-workspace-id")
    return key


def _make_user(**overrides) -> User:
    user = MagicMock(spec=User)
    user.id = overrides.get("id", "test-user-id")
    user.is_active = overrides.get("is_active", True)
    user.email = overrides.get("email", "test@example.com")
    return user


def _make_request(headers: dict) -> Request:
    request = MagicMock(spec=Request)
    request.headers = headers
    request.state = MagicMock()
    return request


def _mock_db_with_key(api_key):
    """Create a mock db that returns api_key for any select query."""
    db = AsyncMock(spec=AsyncSession)
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = api_key
    db.execute.return_value = mock_result
    return db


def _mock_db_with_user(user):
    """Create a mock db that returns user for any select query."""
    db = AsyncMock(spec=AsyncSession)
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = user
    db.execute.return_value = mock_result
    return db


# ─── Hash tests ───

def test_hash_api_key_deterministic():
    key = "ln_test123"
    assert _hash_api_key(key) == hashlib.sha256(key.encode()).hexdigest()


def test_hash_api_key_unique():
    assert _hash_api_key("ln_abc") != _hash_api_key("ln_def")


# ─── Validate API key tests ───

@pytest.mark.asyncio
async def test_validate_api_key_success():
    raw = _make_raw_key()
    api_key = _make_api_key(raw)
    db = _mock_db_with_key(api_key)

    validated = await _validate_api_key(raw, db)
    assert validated == api_key


@pytest.mark.asyncio
async def test_validate_api_key_not_found():
    db = _mock_db_with_key(None)

    with pytest.raises(HTTPException) as exc_info:
        await _validate_api_key("ln_nonexistent", db)
    assert exc_info.value.status_code == 401
    assert "Invalid API key" in exc_info.value.detail


@pytest.mark.asyncio
async def test_validate_api_key_revoked():
    raw = _make_raw_key()
    api_key = _make_api_key(raw, is_active=False)
    db = _mock_db_with_key(api_key)

    with pytest.raises(HTTPException) as exc_info:
        await _validate_api_key(raw, db)
    assert exc_info.value.status_code == 401
    assert "revoked" in exc_info.value.detail


@pytest.mark.asyncio
async def test_validate_api_key_expired():
    raw = _make_raw_key()
    api_key = _make_api_key(raw, expires_at=datetime.now(timezone.utc) - timedelta(hours=1))
    db = _mock_db_with_key(api_key)

    with pytest.raises(HTTPException) as exc_info:
        await _validate_api_key(raw, db)
    assert exc_info.value.status_code == 401
    assert "expired" in exc_info.value.detail


@pytest.mark.asyncio
async def test_validate_api_key_not_expired_future():
    raw = _make_raw_key()
    api_key = _make_api_key(raw, expires_at=datetime.now(timezone.utc) + timedelta(hours=1))
    db = _mock_db_with_key(api_key)

    validated = await _validate_api_key(raw, db)
    assert validated == api_key


# ─── get_current_user with API key tests ───

@pytest.mark.asyncio
async def test_get_current_user_with_api_key():
    raw = _make_raw_key()
    api_key = _make_api_key(raw)
    user = _make_user()
    request = _make_request({"Authorization": f"Bearer {raw}"})

    db = AsyncMock(spec=AsyncSession)
    key_result = MagicMock()
    key_result.scalar_one_or_none.return_value = api_key
    user_result = MagicMock()
    user_result.scalar_one_or_none.return_value = user
    db.execute.side_effect = [key_result, user_result]

    authenticated_user = await get_current_user(request, db)
    assert authenticated_user == user
    assert api_key.last_used_at is not None


@pytest.mark.asyncio
async def test_get_current_user_with_x_api_key_header():
    raw = _make_raw_key()
    api_key = _make_api_key(raw)
    user = _make_user()
    request = _make_request({"X-API-Key": raw})

    db = AsyncMock(spec=AsyncSession)
    key_result = MagicMock()
    key_result.scalar_one_or_none.return_value = api_key
    user_result = MagicMock()
    user_result.scalar_one_or_none.return_value = user
    db.execute.side_effect = [key_result, user_result]

    authenticated_user = await get_current_user(request, db)
    assert authenticated_user == user


@pytest.mark.asyncio
async def test_get_current_user_no_auth():
    request = _make_request({})
    db = AsyncMock(spec=AsyncSession)

    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(request, db)
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_get_current_user_invalid_api_key():
    request = _make_request({"Authorization": "Bearer ln_invalid"})
    db = _mock_db_with_key(None)

    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(request, db)
    assert exc_info.value.status_code == 401


# ─── Scope check tests ───

def test_require_scope_read_allowed():
    api_key = _make_api_key(_make_raw_key(), scopes="read,write")
    request = _make_request({})
    request.state.api_key = api_key

    checker = require_scope("read")
    import asyncio
    asyncio.get_event_loop().run_until_complete(checker(request))


def test_require_scope_write_forbidden():
    api_key = _make_api_key(_make_raw_key(), scopes="read")
    request = _make_request({})
    request.state.api_key = api_key

    checker = require_scope("write")
    import asyncio
    with pytest.raises(HTTPException) as exc_info:
        asyncio.get_event_loop().run_until_complete(checker(request))
    assert exc_info.value.status_code == 403


def test_require_scope_jwt_no_restrictions():
    """JWT auth should not be restricted by scopes."""
    request = _make_request({})
    request.state.api_key = None

    checker = require_scope("admin")
    import asyncio
    asyncio.get_event_loop().run_until_complete(checker(request))


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
