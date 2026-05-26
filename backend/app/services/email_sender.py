from typing import List
from app.config import get_settings

settings = get_settings()

# Emails are logged to console when no email provider is configured


async def send_email(
    to: List[str],
    subject: str,
    html: str,
) -> None:
    print(f"[EMAIL] To: {', '.join(to)} | Subject: {subject}")


async def send_magic_link(email: str, token: str) -> None:
    link = f"{settings.frontend_url}/auth/magic-link?token={token}"
    await send_email(
        to=[email],
        subject="Your LinkNest Magic Link",
        html=f"<p>Click <a href='{link}'>here</a> to sign in to LinkNest.</p>",
    )


async def send_password_reset(email: str, token: str) -> None:
    link = f"{settings.frontend_url}/reset-password?token={token}"
    await send_email(
        to=[email],
        subject="Reset Your LinkNest Password",
        html=f"<p>Click <a href='{link}'>here</a> to reset your password.</p>",
    )


async def send_workspace_invite(email: str, workspace_name: str, invited_by: str, token: str) -> None:
    link = f"{settings.frontend_url}/join?token={token}"
    await send_email(
        to=[email],
        subject=f"You've been invited to {workspace_name} on LinkNest",
        html=f"<p>{invited_by} invited you to join <strong>{workspace_name}</strong> on LinkNest.</p><p><a href='{link}'>Accept invite</a></p>",
    )
