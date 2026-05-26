import string
import secrets

BASE62 = string.digits + string.ascii_lowercase + string.ascii_uppercase


def base62_encode(num: int) -> str:
    if num == 0:
        return BASE62[0]
    encoded = []
    while num > 0:
        num, rem = divmod(num, 62)
        encoded.append(BASE62[rem])
    return "".join(reversed(encoded))


def generate_short_code(length: int = 7) -> str:
    return "".join(secrets.choice(BASE62) for _ in range(length))
