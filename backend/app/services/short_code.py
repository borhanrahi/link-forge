import string


BASE62 = string.digits + string.ascii_lowercase + string.ascii_uppercase


def base62_encode(num: int) -> str:
    if num == 0:
        return BASE62[0]
    encoded = []
    while num > 0:
        num, rem = divmod(num, 62)
        encoded.append(BASE62[rem])
    return "".join(reversed(encoded))


def generate_short_code(sequence_id: int, length: int = 7) -> str:
    code = base62_encode(sequence_id)
    if len(code) < length:
        code = BASE62[0] * (length - len(code)) + code
    return code[:length]
