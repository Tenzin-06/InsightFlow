from rest_framework.exceptions import NotFound
from apps.surveys.models.survey import Survey, SURVEY_STATUS_PUBLISHED


def validate_survey_is_published(survey):
    """Raise NotFound if the survey is not published."""
    if survey.status != SURVEY_STATUS_PUBLISHED:
        raise NotFound("Survey is not publicly available.")
