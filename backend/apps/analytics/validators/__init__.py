from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from apps.analytics.constants import MAX_TREND_DAYS, DEFAULT_TREND_DAYS


def validate_days_param(days: int | str | None) -> int:
    """
    Validate and clamp the `days` query parameter for time-series endpoints.
    Returns a safe integer in [1, MAX_TREND_DAYS].
    """
    try:
        days_int = int(days) if days is not None else DEFAULT_TREND_DAYS
    except (TypeError, ValueError):
        raise ValidationError(
            {"days": f"Must be an integer between 1 and {MAX_TREND_DAYS}."}
        )

    if days_int < 1 or days_int > MAX_TREND_DAYS:
        raise ValidationError(
            {"days": f"Must be between 1 and {MAX_TREND_DAYS}. Got {days_int}."}
        )

    return days_int


def validate_survey_ownership(survey, user) -> None:
    """Raise PermissionDenied if user does not own the survey."""
    if survey.owner_id != user.id:
        raise PermissionDenied("You do not have access to analytics for this survey.")


def validate_campaign_ownership(campaign, user) -> None:
    """Raise PermissionDenied if user does not own the campaign."""
    if campaign.owner_id != user.id:
        raise PermissionDenied("You do not have access to analytics for this campaign.")


def validate_completion_rate(rate: float) -> float:
    """Clamp a completion rate to [0.0, 100.0]."""
    return max(0.0, min(100.0, rate))
