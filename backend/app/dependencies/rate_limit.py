import time
import asyncio
from typing import Optional, Dict, List
from collections import defaultdict

from fastapi import Request, HTTPException, status

from app.config import get_settings

settings = get_settings()

_redis_client: Optional[object] = None
_redis_available: bool = True
_redis_checked: bool = False

# In-memory fallback store
_in_memory_store: Dict[str, List[float]] = defaultdict(list)
_lock = asyncio.Lock()


async def _try_connect_redis():
    """Try to connect to Redis and report availability."""
    global _redis_client, _redis_available, _redis_checked
    if _redis_checked:
        return _redis_available
    _redis_checked = True
    try:
        import redis.asyncio as redis
        _redis_client = redis.from_url(settings.redis_url, decode_responses=True, socket_connect_timeout=2)
        await _redis_client.ping()
        _redis_available = True
    except Exception:
        _redis_available = False
    return _redis_available


async def _check_rate_limit_redis(key: str, max_requests: int, window_seconds: int) -> None:
    """Rate limit using Redis sorted sets."""
    import redis.asyncio as redis
    r = _redis_client
    now = time.time()
    window_start = now - window_seconds
    await r.zremrangebyscore(key, 0, window_start)
    request_count = await r.zcard(key)
    if request_count >= max_requests:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded",
        )
    await r.zadd(key, {str(now): now})
    await r.expire(key, window_seconds)


async def _check_rate_limit_memory(key: str, max_requests: int, window_seconds: int) -> None:
    """Rate limit using in-memory store as fallback."""
    async with _lock:
        now = time.time()
        window_start = now - window_seconds
        timestamps = [t for t in _in_memory_store[key] if t > window_start]
        if len(timestamps) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
            )
        timestamps.append(now)
        _in_memory_store[key] = timestamps


async def rate_limiter(
    request: Request,
    max_requests: int = 60,
    window_seconds: int = 60,
) -> None:
    client_ip = request.client.host if request.client else "unknown"
    key = f"rate_limit:{client_ip}:{request.url.path}"

    available = await _try_connect_redis()
    if available:
        await _check_rate_limit_redis(key, max_requests, window_seconds)
    else:
        await _check_rate_limit_memory(key, max_requests, window_seconds)
