import logging

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

DATABASE_URL = (settings.database_url or "").strip()

engine = (
    create_async_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )
    if DATABASE_URL
    else None
)
async_session_factory = (
    async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    if engine
    else None
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    if async_session_factory is None:
        raise RuntimeError(
            "DATABASE_URL is not configured. "
            "Set it in your environment or .env file (see .env.example)."
        )
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
