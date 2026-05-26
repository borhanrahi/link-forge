import socket
import struct
from typing import Optional, Tuple


class GeoIPService:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._reader = None

    async def lookup(self, ip_address: str) -> Tuple[Optional[str], Optional[str]]:
        try:
            return None, None
        except Exception:
            return None, None


geo_ip_service = GeoIPService(db_path="")
