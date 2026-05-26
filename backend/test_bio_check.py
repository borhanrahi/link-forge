"""Check bio page data and test serialization."""
import asyncio
import sys
sys.path.insert(0, '.')
from app.database import AsyncSessionLocal
from app.models.bio_page import BioPage
from app.models.link import Link
from app.schemas.bio_page import BioPageResponse
from app.schemas.link import LinkResponse
from sqlalchemy import select
from sqlalchemy.orm import selectinload
import app.models  # noqa: ensure all models loaded


async def check():
    async with AsyncSessionLocal() as db:
        # Check bio pages
        r = await db.execute(
            select(BioPage)
            .options(selectinload(BioPage.blocks))
            .limit(5)
        )
        pages = r.scalars().all()
        print(f'BioPages count: {len(pages)}')
        for p in pages:
            print(f'  id={p.id} ws={p.workspace_id} slug={p.slug} clicks={p.clicks_count!r} blocks_count={len(p.blocks)}')
            # Test validation
            try:
                resp = BioPageResponse.model_validate(p)
                print(f'    VALIDATION OK: title={resp.title}')
            except Exception as e:
                print(f'    VALIDATION ERROR: {e}')

        # Check links
        r2 = await db.execute(select(Link).limit(5))
        links = r2.scalars().all()
        print(f'Links count: {len(links)}')
        for l in links:
            print(f'  id={l.id} ws={l.workspace_id} clicks={l.clicks_count!r}')
            try:
                resp = LinkResponse.model_validate(l)
                print(f'    VALIDATION OK: title={resp.title}')
            except Exception as e:
                print(f'    VALIDATION ERROR: {e}')


asyncio.run(check())
