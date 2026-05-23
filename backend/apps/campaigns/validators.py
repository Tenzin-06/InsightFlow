from rest_framework import serializers
from apps.campaigns.constants import CAMPAIGN_STATUS_CHOICES, VALID_TRANSITIONS

VALID_STATUS_VALUES = {s[0] for s in CAMPAIGN_STATUS_CHOICES}


def validate_campaign_status_transition(current_status, new_status):
    """Raise ValidationError if the status transition is not allowed."""
    allowed = VALID_TRANSITIONS.get(current_status, set())
    if new_status != current_status and new_status not in allowed:
        raise serializers.ValidationError(
            f"Cannot transition campaign from '{current_status}' to '{new_status}'."
        )


def validate_email_format(email):
    """Raise ValidationError if email format is invalid."""
    import re
    pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    if not re.match(pattern, email):
        raise serializers.ValidationError(f"'{email}' is not a valid email address.")
