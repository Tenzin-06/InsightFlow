import re
from rest_framework.exceptions import ValidationError


def validate_email_format(email: str) -> bool:
    """Return True if email looks valid, False otherwise."""
    pattern = r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email.strip()))


def validate_campaign_ready_to_send(campaign) -> None:
    """
    Raise ValidationError if the campaign is missing required fields
    to initiate email delivery.
    """
    if not campaign.subject:
        raise ValidationError("Campaign is missing a subject line.")
    if not campaign.audiences.exists():
        raise ValidationError("Campaign has no audiences selected.")
    total_recipients = sum(
        a.recipients.count() for a in campaign.audiences.all()
    )
    if total_recipients == 0:
        raise ValidationError("Campaign audience has no recipients.")


def validate_test_email_address(email: str) -> None:
    """Raise ValidationError if the provided test address is invalid."""
    if not validate_email_format(email):
        raise ValidationError(f"'{email}' is not a valid email address.")
