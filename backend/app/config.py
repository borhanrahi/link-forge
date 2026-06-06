from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ─── Database ───
    database_url: str = Field(default="")

    # ─── Redis ───
    redis_url: str = "redis://localhost:6379/0"

    # ─── CORS ───
    frontend_url: str = "http://localhost:3000"
    extra_cors_origins: str = ""

    # ─── Auth ───
    neon_auth_url: str = Field(default="")
    neon_auth_audience: str = Field(default="")
    dev_auth_bypass: bool = False
    secret_key: str = Field(default="")

    # ─── Rate limiting ───
    rate_limit_per_min: int = 60
    rate_limit_window_seconds: int = 60

    # ─── GeoIP ───
    geolite_db_path: str = "./GeoLite2-City.mmdb"

    # ─── R2 / S3 storage ───
    r2_endpoint: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = "linknest-assets"
    r2_public_url: str = ""

    # ─── Stripe ───
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_pro_price_id: str = ""
    stripe_business_price_id: str = ""
    stripe_dummy_mode: bool = False

    # ─── Email ───
    resend_api_key: str = ""
    email_from: str = "LinkNest <noreply@linknest.app>"

    # ─── App ───
    environment: str = "development"
    short_link_base_url: str = "http://localhost:3000"
    max_click_payload_kb: int = 4

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",
    }

    @field_validator("environment")
    @classmethod
    def _validate_environment(cls, v: str) -> str:
        v_norm = v.lower()
        if v_norm not in {"development", "staging", "production", "test"}:
            raise ValueError(
                "environment must be one of: development, staging, production, test"
            )
        return v_norm

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def cors_origins(self) -> List[str]:
        origins = {
            self.frontend_url,
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        }
        if self.extra_cors_origins:
            for raw in self.extra_cors_origins.split(","):
                cleaned = raw.strip()
                if cleaned:
                    origins.add(cleaned)
        return sorted(origins)


@lru_cache
def get_settings() -> Settings:
    return Settings()
