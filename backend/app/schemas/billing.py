from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class PlanResponse(BaseModel):
    id: str
    name: str
    price: int
    currency: str = "usd"
    interval: str = "month"
    features: List[str] = []


class CheckoutRequest(BaseModel):
    price_id: str
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class CheckoutResponse(BaseModel):
    url: str
    session_id: str


class InvoiceResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    amount_due: int
    amount_paid: int
    currency: str
    status: str
    pdf_url: Optional[str] = None
    invoice_date: Optional[datetime] = None

    model_config = {"from_attributes": True}
