import io
from typing import Optional

import qrcode
from qrcode.image.pil import PilImage


def generate_qr(
    url: str,
    fg_color: str = "#000000",
    bg_color: str = "#ffffff",
    logo_bytes: Optional[bytes] = None,
) -> bytes:
    qr = qrcode.QRCode(box_size=10, border=2)
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color=fg_color, back_color=bg_color).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
