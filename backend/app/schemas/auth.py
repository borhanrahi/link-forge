from pydantic import BaseModel


class NeonCallbackRequest(BaseModel):
    """Callback from Neon Auth after successful authentication."""
    email: str
    name: str = ""
