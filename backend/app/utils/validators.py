from typing import Optional
from uuid import UUID
from datetime import datetime
import re


def validate_slug(slug: str) -> bool:
    return bool(re.match(r"^[a-z0-9-]+$", slug))


def validate_hex_color(color: str) -> bool:
    return bool(re.match(r"^#[0-9a-fA-F]{6}$", color))


def validate_url(url: str) -> bool:
    return url.startswith("http://") or url.startswith("https://")
