import dns.resolver
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.custom_domain import CustomDomain


async def verify_domain(domain: str, expected_txt: Optional[str] = None) -> bool:
    try:
        answers = dns.resolver.resolve(f"_linknest.{domain}", "TXT")
        for rdata in answers:
            txt_value = "".join(rdata.strings)
            if expected_txt and txt_value.strip('"') == expected_txt:
                return True
        return False
    except Exception:
        return False


async def verify_domain_ownership(db: AsyncSession, domain_id: str) -> bool:
    result = await db.execute(select(CustomDomain).where(CustomDomain.id == domain_id))
    domain_record = result.scalar_one_or_none()
    if not domain_record:
        return False

    verified = await verify_domain(domain_record.domain, domain_record.verification_txt)
    if verified:
        domain_record.status = "verified"
        await db.commit()
    return verified
