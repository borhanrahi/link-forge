import asyncio
import logging
import time
from collections import defaultdict, deque
from typing import Deque, Dict, Optional, Tuple

from fastapi import HTTPException, Request, status

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_redis_client: Optional[object] = None
_redis_available: bool = True
_redis_checked: bool = False

_in_memory_store: Dict[str, Deque[float]] = defaultdict(deque)
_in_memory_lock = asyncio.Lock()
_IN_MEMORY_MAX_KEYS = 50_000


def _client_key(request: Request) -> str:
    if getattr(request.state, "user_id", None):
        return f"user:{request.state.user_id}"
    if getattr(request.state, "workspace_id", None):
        return f"ws:{request.state.workspace_id}"
    host = request.client.host if request.client else "unknown"
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        host = forwarded.split(",")[0].strip()
    return f"ip:{host}"


def _limit_for_path(path: str) -> Tuple[int, int]:
    if path.startswith("/r/") or path.startswith("/b/") or path == "/":
        return settings.rate_limit_per_min * 4, settings.rate_limit_window_seconds
    if path.startswith("/api/v1/redirect"):
        return settings.rate_limit_per_min * 4, settings.rate_limit_window_seconds
    return settings.rate_limit_per_min, settings.rate_limit_window_seconds


async def _try_connect_redis() -> bool:
    global _redis_client, _redis_available, _redis_checked
    if _redis_checked:
        return _redis_available
    _redis_checked = True
    if not settings.redis_url:
        _redis_available = False
        return False
    try:
        import redis.asyncio as redis

        _redis_client = redis.from_url(
            settings.redis_url,
            decode_responses=True,
            socket_connect_timeout=2,
            socket_timeout=2,
        )
        await _redis_client.ping()
        _redis_available = True
    except Exception as exc:
        logger.info("Redis unavailable, using in-memory rate limit: %s", exc)
        _redis_available = False
    return _redis_available


async def _check_rate_limit_redis(
    key: str, max_requests: int, window_seconds: int
) -> None:
    import redis.asyncio as redis

    r = _redis_client
    full_key = f"rl:{key}"
    now = time.time()
    window_start = now - window_seconds
    pipe = r.pipeline()
    pipe.zremrangebyscore(full_key, 0, window_start)
    pipe.zcard(full_key)
    _, count = await pipe.execute()
    if count >= max_requests:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded",
            headers={"Retry-After": str(window_seconds)},
        )
    pipe = r.pipeline()
    pipe.zadd(full_key, {f"{now}:{id(object())}": now})
    pipe.expire(full_key, window_seconds)
    await pipe.execute()


async def _check_rate_limit_memory(
    key: str, max_requests: int, window_seconds: int
) -> None:
    async with _in_memory_lock:
        if len(_in_memory_store) > _IN_MEMORY_MAX_KEYS and key not in _in_memory_store:
            cutoff = time.time() - window_seconds
            stale = [k for k, v in _in_memory_store.items() if not v or v[-1] < cutoff]
            for k in stale[: len(stale) // 2 or 1]:
                _in_memory_store.pop(k, None)

        now = time.time()
        window_start = now - window_seconds
        bucket = _in_memory_store[key]
        while bucket and bucket[0] < window_start:
            bucket.popleft()
        if len(bucket) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={"Retry-After": str(window_seconds)},
            )
        bucket.append(now)


async def rate_limiter(
    request: Request,
    max_requests: Optional[int] = None,
    window_seconds: Optional[int] = None,
) -> None:
    key = f"{_client_key(request)}:{request.url.path}"

    if max_requests is None or window_seconds is None:
        default_max, default_window = _limit_for_path(request.url.path)
        max_requests = max_requests or default_max
        window_seconds = window_seconds or default_window

    if await _try_connect_redis():
        await _check_rate_limit_redis(key, max_requests, window_seconds)
    else:
        await _check_rate_limit_memory(key, max_requests, window_seconds)
