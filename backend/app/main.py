from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager

from app.config import get_settings
from app.database import engine, Base

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title="LinkNest API",
        version="2.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000", "http://127.0.0.1:8000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from app.routers import auth, users, workspaces, links, clicks, analytics, bio_pages, bio_public, qr_codes, custom_domains, utm, billing, subscriptions, webhooks, redirect

    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(workspaces.router)
    app.include_router(links.router)
    app.include_router(clicks.router)
    app.include_router(analytics.router)
    app.include_router(bio_pages.router)
    app.include_router(bio_public.router)
    app.include_router(qr_codes.router)
    app.include_router(custom_domains.router)
    app.include_router(utm.router)
    app.include_router(billing.router)
    app.include_router(subscriptions.router)
    app.include_router(webhooks.router)
    app.include_router(redirect.router)

    @app.get("/")
    async def root():
        return RedirectResponse(url="/docs")

    return app


app = create_app()
