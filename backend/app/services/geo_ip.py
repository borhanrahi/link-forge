"""
GeoIP service backed by MaxMind GeoLite2-City .mmdb file.

The database is opened lazily on first lookup. If the file is missing or
malformed, the service degrades gracefully to returning (None, None) so
click tracking never breaks because of an analytics dependency.

The underlying library is `maxminddb` (sync, very fast), so we run the
lookup in a thread to keep the request path non-blocking.
"""

import asyncio
import ipaddress
import logging
import os
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

try:
    import maxminddb
except ImportError:  # pragma: no cover - dependency missing
    maxminddb = None
    logger.warning("maxminddb not installed; GeoIP lookups will return None.")


class GeoIPService:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._reader: Optional["maxminddb.Reader"] = None
        self._load_attempted = False

    def _ensure_reader(self) -> Optional["maxminddb.Reader"]:
        if self._reader is not None or self._load_attempted:
            return self._reader

        self._load_attempted = True
        if maxminddb is None:
            return None
        if not self.db_path or not os.path.isfile(self.db_path):
            logger.info(
                "GeoLite2 database not found at %s; GeoIP disabled.",
                self.db_path or "(empty path)",
            )
            return None
        try:
            self._reader = maxminddb.open_database(self.db_path)
            logger.info("Loaded GeoLite2 database from %s", self.db_path)
        except Exception as exc:
            logger.warning("Failed to open GeoLite2 database: %s", exc)
            self._reader = None
        return self._reader

    @staticmethod
    def _is_public_ip(ip: str) -> bool:
        try:
            addr = ipaddress.ip_address(ip)
        except ValueError:
            return False
        return not (
            addr.is_private
            or addr.is_loopback
            or addr.is_reserved
            or addr.is_multicast
            or addr.is_unspecified
        )

    def _lookup_sync(self, ip_address: str) -> Tuple[Optional[str], Optional[str]]:
        reader = self._ensure_reader()
        if reader is None or not self._is_public_ip(ip_address):
            return None, None
        try:
            record = reader.get(ip_address)
        except (ValueError, TypeError):
            return None, None
        if not isinstance(record, dict):
            return None, None

        country = (
            record.get("country")
            or record.get("registered_country")
            or {}
        )
        city = record.get("city") or {}

        country_code = country.get("iso_code") if isinstance(country, dict) else None
        city_name = (
            city.get("names", {}).get("en")
            if isinstance(city, dict)
            else None
        )
        return country_code, city_name

    async def lookup(self, ip_address: str) -> Tuple[Optional[str], Optional[str]]:
        if not ip_address:
            return None, None
        try:
            return await asyncio.to_thread(self._lookup_sync, ip_address)
        except Exception as exc:
            logger.debug("GeoIP lookup failed for %s: %s", ip_address, exc)
            return None, None

    async def close(self) -> None:
        if self._reader is not None:
            try:
                self._reader.close()
            except Exception:  # pragma: no cover
                pass
            self._reader = None


def _resolve_default_db_path() -> str:
    from app.config import get_settings
    return get_settings().geolite_db_path


geo_ip_service = GeoIPService(db_path=_resolve_default_db_path())
