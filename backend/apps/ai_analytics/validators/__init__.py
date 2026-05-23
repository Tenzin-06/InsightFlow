"""
Validators for AI analytics requests and data.
"""

from __future__ import annotations

from rest_framework.exceptions import NotFound, PermissionDenied


def validate_survey_ownership(survey_id: int, owner_id: int) -> "Survey":  # type: ignore[name-defined]
    """
    Verify the survey exists and belongs to the requesting user.

    Raises:
        NotFound        — survey does not exist
        PermissionDenied — survey owned by someone else
    """
    from apps.surveys.models.survey import Survey

    try:
        survey = Survey.objects.get(pk=survey_id)
    except Survey.DoesNotExist:
        raise NotFound(f"Survey {survey_id} not found.")

    if survey.owner_id != owner_id:
        raise PermissionDenied("You do not have access to this survey.")

    return survey


def validate_confidence_range(value: float) -> float:
    """Clamp confidence to [0.0, 1.0]."""
    return max(0.0, min(1.0, float(value)))


def validate_quality_score_range(value: int | float) -> int:
    """Clamp quality score to [0, 100]."""
    return max(0, min(100, int(float(value))))
