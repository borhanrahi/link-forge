from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.config import get_settings
from app.database import Base, engine
from app.services.geo_ip import geo_ip_service

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    try:
        yield
    finally:
        await engine.dispose()
        await geo_ip_service.close()


def create_app() -> FastAPI:
    app = FastAPI(
        title="LinkNest API",
        version="2.0",
        lifespan=lifespan,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=[
            "Authorization",
            "Content-Type",
            "X-API-Key",
            "X-User-Email",
            "X-Workspace-Id",
        ],
        expose_headers=["X-Request-Id"],
        max_age=600,
    )

    from app.routers import (
        ab_tests,
        analytics,
        api_keys,
        auth,
        billing,
        bio_pages,
        bio_public,
        click_goal_alerts,
        clicks,
        custom_domains,
        export_import,
        links,
        notifications,
        qr_codes,
        redirect,
        subscriptions,
        tags,
        users,
        utm,
        webhooks,
        workspaces,
    )

    for router in (
        auth.router,
        users.router,
        workspaces.router,
        links.router,
        clicks.router,
        analytics.router,
        bio_pages.router,
        bio_public.router,
        qr_codes.router,
        custom_domains.router,
        utm.router,
        billing.router,
        subscriptions.router,
        webhooks.router,
        notifications.router,
        tags.router,
        api_keys.router,
        click_goal_alerts.router,
        ab_tests.router,
        redirect.router,
        export_import.router,
    ):
        app.include_router(router)

    @app.get("/", include_in_schema=False)
    async def root():
        return RedirectResponse(url="/docs")

    return app


app = create_app()
