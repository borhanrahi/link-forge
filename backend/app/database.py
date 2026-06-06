import logging

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()


def _resolve_database_url() -> str:
    url = (settings.database_url or "").strip()
    if not url:
        raise RuntimeError(
            "DATABASE_URL is not configured. "
            "Set it in your environment or .env file (see .env.example)."
        )
    if url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://") :]
    if not url.startswith(("postgresql+psycopg://", "postgresql+asyncpg://")):
        raise RuntimeError(
            "DATABASE_URL must use the 'postgresql+psycopg://' or "
            "'postgresql+asyncpg://' scheme for async SQLAlchemy."
        )
    return url


engine = create_async_engine(
    _resolve_database_url(),
    echo=False,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)
async_session_factory = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
