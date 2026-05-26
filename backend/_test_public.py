"""Test the public bio page endpoint with full traceback capture."""
import traceback
import sys
import asyncio
from fastapi.testclient import TestClient

sys.path.insert(0, '.')

try:
    from app.main import create_app
    app = create_app()
    client = TestClient(app)
    
    print("Testing /b/test6...")
    response = client.get("/b/test6")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:500]}")
    
except Exception as e:
    traceback.print_exc()
    print(f"\nError: {e}")
