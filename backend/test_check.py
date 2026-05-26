import asyncio
import sys
sys.path.insert(0, '.')

from app.database import AsyncSessionLocal
from app.models.user import User
from app.models.workspace import Workspace
from app.models.bio_page import BioPage
from sqlalchemy import select
import app.models  # ensure all models loaded

async def main():
    async with AsyncSessionLocal() as db:
        r = await db.execute(select(User).limit(5))
        users = r.scalars().all()
        print(f"Users found: {len(users)}")
        for u in users:
            print(f"  email={u.email} id={u.id} default_ws={u.default_workspace_id} active={u.is_active}")
        
        if users:
            r2 = await db.execute(select(Workspace).limit(5))
            ws = r2.scalars().all()
            print(f"Workspaces found: {len(ws)}")
            for w in ws:
                print(f"  id={w.id} name={w.name} owner={w.owner_id} plan={w.plan}")
            
            r3 = await db.execute(select(BioPage).limit(10))
            pages = r3.scalars().all()
            print(f"BioPages found: {len(pages)}")
            for p in pages:
                print(f"  id={p.id} slug={p.slug} ws={p.workspace_id} user={p.user_id}")
            
            # Check if user found by email
            first_email = users[0].email
            r4 = await db.execute(select(User).where(User.email == first_email))
            found = r4.scalar_one_or_none()
            print(f"\nLookup by email '{first_email}': {'FOUND' if found else 'NOT FOUND'}")

asyncio.run(main())
