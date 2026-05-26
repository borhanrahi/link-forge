"""Test the bio-pages API endpoint directly."""
import asyncio
import sys
sys.path.insert(0, '.')

from httpx import AsyncClient, ASGITransport

# Import the FastAPI app
from app.main import app
from app.config import get_settings

settings = get_settings()
print(f"dev_auth_bypass: {settings.dev_auth_bypass}")

async def test():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test GET /bio-pages with dev bypass headers
        headers = {
            "X-User-Email": settings.dev_auth_bypass and "test@test.com" or "test@example.com",
            "X-Workspace-Id": "test",
        }
        print(f"Headers: {headers}")
        response = await client.get("/bio-pages", headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
        if response.status_code == 401:
            print("Auth failed - trying to create a user first via neon-callback")
            # Try creating a user
            cb_response = await client.post(
                "/auth/neon-callback",
                json={"email": "test@test.com", "name": "Test User"}
            )
            print(f"Callback status: {cb_response.status_code}")
            print(f"Callback response: {cb_response.text[:500]}")
            
            if cb_response.status_code == 201:
                # Now try bio-pages again
                user_data = cb_response.json()
                ws_id = user_data.get("default_workspace_id")
                print(f"User created with workspace: {ws_id}")
                headers["X-Workspace-Id"] = str(ws_id) if ws_id else "test"
                response2 = await client.get("/bio-pages", headers=headers)
                print(f"Retry status: {response2.status_code}")
                print(f"Retry response: {response2.text[:500]}")
                
                if response2.status_code == 200:
                    # Try creating a bio page
                    create_resp = await client.post(
                        "/bio-pages",
                        headers=headers,
                        json={
                            "slug": "test-page-" + str(asyncio.get_event_loop().time())[-5:],
                            "title": "Test Page",
                            "theme": "minimal",
                        }
                    )
                    print(f"\nCreate status: {create_resp.status_code}")
                    print(f"Create response: {create_resp.text[:500]}")
                    
                    # List again
                    response3 = await client.get("/bio-pages", headers=headers)
                    print(f"\nList after create status: {response3.status_code}")
                    print(f"List after create response: {response3.text[:500]}")

asyncio.run(test())
