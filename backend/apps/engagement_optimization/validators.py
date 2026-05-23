from rest_framework.exceptions import ValidationError

from apps.engagement_optimization.constants import TRIGGER_TYPE_CHOICES


def validate_trigger_type(value: str) -> str:
    valid = {choice[0] for choice in TRIGGER_TYPE_CHOICES}
    if value not in valid:
        raise ValidationError(f"Invalid trigger_type '{value}'. Choices: {sorted(valid)}.")
    return value


def validate_delay_days(value: int) -> int:
    if value < 1:
        raise ValidationError("delay_days must be at least 1.")
    if value > 30:
        raise ValidationError("delay_days must not exceed 30.")
    return value


def validate_reminder_limit(value: int) -> int:
    from apps.engagement_optimization.constants import DEFAULT_MAX_REMINDERS_PER_CAMPAIGN

    if value < 1:
        raise ValidationError("reminder_limit must be at least 1.")
    if value > DEFAULT_MAX_REMINDERS_PER_CAMPAIGN:
        raise ValidationError(
            f"reminder_limit must not exceed {DEFAULT_MAX_REMINDERS_PER_CAMPAIGN}."
        )
    return value
