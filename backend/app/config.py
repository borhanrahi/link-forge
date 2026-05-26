from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://neondb_owner:npg_gd9LKWj2oQOq@ep-bold-brook-ap2c55hh-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    redis_url: str = "redis://localhost:6379"
    frontend_url: str = "http://localhost:3000"
    geolite_db_path: str = "./GeoLite2-City.mmdb"

    neon_auth_url: str = "https://ep-bold-brook-ap2c55hh.neonauth.c-7.us-east-1.aws.neon.tech/neondb/auth"

    r2_endpoint: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = "linknest-assets"
    r2_public_url: str = ""

    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_pro_price_id: str = ""
    stripe_business_price_id: str = ""

    resend_api_key: str = ""
    email_from: str = "LinkNest <noreply@linknest.app>"

    # Dev mode: skip JWKS validation and decode JWT payload directly
    dev_auth_bypass: bool = False

    model_config = {"env_file": ".env", "case_sensitive": False, "extra": "ignore"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
