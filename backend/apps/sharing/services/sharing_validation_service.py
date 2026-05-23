from rest_framework.exceptions import NotFound
from apps.surveys.models.survey import Survey, SURVEY_STATUS_PUBLISHED


def get_published_survey_by_slug(slug):
    """
    Return the survey matching the slug only if it is published.
    Raises NotFound for missing or non-published surveys.
    """
    try:
        survey = Survey.objects.get(slug=slug)
    except Survey.DoesNotExist:
        raise NotFound("Survey not found.")

    if survey.status != SURVEY_STATUS_PUBLISHED:
        raise NotFound("Survey is not publicly available.")

    return survey
