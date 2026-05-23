"""
Recipient utilities.

Prepares recipient-specific data for personalized email delivery.
Handles validation, normalization, and skipping of invalid addresses.
"""

import logging
from typing import Iterator
from apps.campaigns.models.recipient import Recipient
from apps.email_campaigns.validators import validate_email_format

logger = logging.getLogger(__name__)


def normalize_email(email: str) -> str:
    """Strip whitespace and lowercase an email address."""
    return email.strip().lower()


def iter_valid_recipients(campaign) -> Iterator[Recipient]:
    """
    Yield valid Recipient objects from all audiences attached to a campaign.

    - Deduplicates by email address across audiences.
    - Skips malformed email addresses (logs a warning per skip).
    - Fetches audiences + recipients with a single prefetch call.
    """
    seen_emails: set[str] = set()

    audiences = campaign.audiences.prefetch_related("recipients").all()
    for audience in audiences:
        for recipient in audience.recipients.all():
            email = normalize_email(recipient.email)
            if email in seen_emails:
                continue
            if not validate_email_format(email):
                logger.warning(
                    "Skipping invalid recipient email '%s' in audience '%s'",
                    email,
                    audience.name,
                )
                continue
            seen_emails.add(email)
            # Yield with normalized email attached
            recipient.email = email
            yield recipient


def collect_recipients(campaign) -> list[Recipient]:
    """Return a deduplicated list of valid recipients for a campaign."""
    return list(iter_valid_recipients(campaign))
