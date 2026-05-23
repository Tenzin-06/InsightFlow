"""
Resend email delivery service.

Wraps the Resend Python SDK to send transactional HTML emails
with a plain-text fallback. All Resend communication is
isolated here — no other layer should call resend directly.

The resend SDK is imported lazily at send time so the application
can start without the package installed (useful for local dev
before resend is in the environment).
"""

import logging
from django.conf import settings
from dataclasses import dataclass, field
from typing import Optional

logger = logging.getLogger(__name__)


def _get_resend():
    """Lazily import and configure the resend SDK."""
    try:
        import resend  # type: ignore[import-untyped]
    except ImportError:
        raise RuntimeError(
            "The 'resend' package is not installed. "
            "Run: pip install resend>=2.0"
        )
    api_key = getattr(settings, "RESEND_API_KEY", "")
    if not api_key:
        logger.warning("RESEND_API_KEY is not configured — emails will not be delivered.")
    resend.api_key = api_key
    return resend


@dataclass
class SendEmailRequest:
    to: str
    subject: str
    html_body: str
    text_body: str
    from_email: Optional[str] = None
    reply_to: Optional[str] = None


@dataclass
class SendEmailResult:
    success: bool
    provider_message_id: str = field(default="")
    error_message: str = field(default="")


def send_email(request: SendEmailRequest) -> SendEmailResult:
    """
    Send a single email via Resend.

    Returns a SendEmailResult with success/failure details.
    Never raises — errors are captured and returned in the result.
    """
    from_address = request.from_email or getattr(
        settings, "DEFAULT_FROM_EMAIL", "noreply@insightflow.ai"
    )

    try:
        resend = _get_resend()
    except RuntimeError as exc:
        logger.error("Resend SDK unavailable: %s", exc)
        return SendEmailResult(success=False, error_message=str(exc))

    params = {
        "from": from_address,
        "to": [request.to],
        "subject": request.subject,
        "html": request.html_body,
        "text": request.text_body,
    }

    if request.reply_to:
        params["reply_to"] = request.reply_to

    try:
        response = resend.Emails.send(params)
        message_id = (
            response.get("id", "") if isinstance(response, dict)
            else getattr(response, "id", "")
        )
        logger.info("Email sent to %s — message_id=%s", request.to, message_id)
        return SendEmailResult(success=True, provider_message_id=str(message_id))

    except Exception as exc:  # noqa: BLE001
        logger.error("Resend error sending to %s: %s", request.to, exc)
        return SendEmailResult(success=False, error_message=str(exc))
