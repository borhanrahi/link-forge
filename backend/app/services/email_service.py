import httpx
from app.config import get_settings

settings = get_settings()


async def send_email(to: str, subject: str, html: str) -> bool:
    """Send an email via Resend API."""
    if not settings.resend_api_key:
        print(f"[EmailService] No API key configured. Would send to {to}: {subject}")
        return False

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {settings.resend_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": settings.email_from,
                "to": [to],
                "subject": subject,
                "html": html,
            },
            timeout=10.0,
        )
        return response.status_code == 200


async def send_invite_email(email: str, workspace_name: str, invited_by: str) -> bool:
    html = f"""
    <h2>You've been invited to {workspace_name}</h2>
    <p>{invited_by} has invited you to join their workspace on LinkNest.</p>
    <p><a href="{settings.frontend_url}">Click here to get started</a></p>
    """
    return await send_email(email, f"Invitation to {workspace_name} on LinkNest", html)


async def send_goal_alert_email(email: str, link_title: str, goal_clicks: int) -> bool:
    html = f"""
    <h2>Click Goal Achieved!</h2>
    <p>Your link "{link_title}" has reached {goal_clicks} clicks.</p>
    <p><a href="{settings.frontend_url}/dashboard">View your dashboard</a></p>
    """
    return await send_email(email, f"Goal reached: {link_title}", html)


async def send_password_reset_email(email: str, reset_token: str) -> bool:
    reset_url = f"{settings.frontend_url}/reset-password?token={reset_token}"
    html = f"""
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <p><a href="{reset_url}">Reset Password</a></p>
    <p>This link expires in 1 hour.</p>
    """
    return await send_email(email, "Reset your LinkNest password", html)
