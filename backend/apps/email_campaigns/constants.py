# Re-export template identifiers from campaigns (single source of truth)
from apps.campaigns.constants import (  # noqa: F401
    TEMPLATE_SURVEY_INVITATION,
    TEMPLATE_REMINDER,
    TEMPLATE_TEST,
    TEMPLATE_CHOICES,
)

# Delivery log statuses
DELIVERY_STATUS_PENDING = "pending"
DELIVERY_STATUS_SENT = "sent"
DELIVERY_STATUS_FAILED = "failed"

DELIVERY_STATUS_CHOICES = [
    (DELIVERY_STATUS_PENDING, "Pending"),
    (DELIVERY_STATUS_SENT, "Sent"),
    (DELIVERY_STATUS_FAILED, "Failed"),
]

# Survey link format
SURVEY_LINK_STANDARD = "standard"
SURVEY_LINK_CONVERSATIONAL = "conversational"

# Personalization variable defaults
DEFAULT_FIRST_NAME = "Participant"
