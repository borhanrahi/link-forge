import httpx
from typing import Optional
from app.config import get_settings

settings = get_settings()

STRIPE_API = "https://api.stripe.com/v1"


def _auth_headers() -> dict:
    return {"Authorization": f"Bearer {settings.stripe_secret_key}"}


async def create_checkout_session(
    price_id: str,
    workspace_id: str,
    success_url: str,
    cancel_url: str,
    customer_email: Optional[str] = None,
) -> dict:
    """Create a Stripe Checkout Session."""
    if not settings.stripe_secret_key:
        # Dummy mode for development
        return {
            "url": success_url,
            "session_id": f"cs_dummy_{workspace_id}",
        }

    data = {
        "line_items[0][price]": price_id,
        "line_items[0][quantity]": "1",
        "mode": "subscription",
        "success_url": success_url,
        "cancel_url": cancel_url,
        "metadata[workspace_id]": workspace_id,
    }
    if customer_email:
        data["customer_email"] = customer_email

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{STRIPE_API}/checkout/sessions",
            headers=_auth_headers(),
            data=data,
            timeout=15.0,
        )
        result = response.json()
        return {"url": result.get("url", ""), "session_id": result.get("id", "")}


async def create_portal_session(customer_id: str, return_url: str) -> dict:
    """Create a Stripe Customer Portal session."""
    if not settings.stripe_secret_key:
        return {"url": return_url}

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{STRIPE_API}/billing_portal/sessions",
            headers=_auth_headers(),
            data={
                "customer": customer_id,
                "return_url": return_url,
            },
            timeout=15.0,
        )
        result = response.json()
        return {"url": result.get("url", "")}


async def cancel_subscription(subscription_id: str) -> bool:
    """Cancel a Stripe subscription at period end."""
    if not settings.stripe_secret_key:
        return True

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{STRIPE_API}/subscriptions/{subscription_id}",
            headers=_auth_headers(),
            data={"cancel_at_period_end": "true"},
            timeout=15.0,
        )
        return response.status_code == 200
