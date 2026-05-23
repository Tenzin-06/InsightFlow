"""
Personalization utilities.

Centralizes variable injection and recipient-specific
email content generation.
"""

from apps.email_campaigns.constants import DEFAULT_FIRST_NAME


def build_email_context(
    recipient_email: str,
    first_name: str,
    survey_link: str,
    campaign_name: str,
    extra: dict | None = None,
) -> dict:
    """
    Build the template context dict for a single recipient.

    Supported template variables:
      {{ first_name }}        — recipient's first name
      {{ survey_link }}       — survey access URL
      {{ campaign_name }}     — campaign title
      {{ recipient_email }}   — recipient email address

    Args:
        recipient_email: The delivery target address.
        first_name: Recipient's first name (falls back to DEFAULT_FIRST_NAME).
        survey_link: Full survey URL for this campaign.
        campaign_name: Human-readable campaign title.
        extra: Additional template variables merged into context.

    Returns:
        Template context dict.
    """
    context = {
        "first_name": first_name.strip() if first_name.strip() else DEFAULT_FIRST_NAME,
        "survey_link": survey_link,
        "campaign_name": campaign_name,
        "recipient_email": recipient_email,
    }
    if extra:
        context.update(extra)
    return context
