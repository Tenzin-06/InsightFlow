"""
Template utilities.

Helpers for survey link generation and template name resolution.
"""

from django.conf import settings
from apps.campaigns.constants import (
    TEMPLATE_SURVEY_INVITATION,
    TEMPLATE_REMINDER,
    TEMPLATE_TEST,
)

# Valid template identifiers
VALID_TEMPLATES = {TEMPLATE_SURVEY_INVITATION, TEMPLATE_REMINDER, TEMPLATE_TEST}


def get_survey_link(survey, link_type: str = "standard") -> str:
    """
    Generate the survey access URL.

    Standard format:  {APP_FRONTEND_URL}/s/{slug_or_id}
    Conversational:   {APP_FRONTEND_URL}/s/{slug_or_id}/chat

    Uses the survey slug if available, otherwise falls back to the survey ID.
    """
    base_url = getattr(settings, "APP_FRONTEND_URL", "http://localhost:5173")
    identifier = getattr(survey, "slug", None) or survey.pk
    path = f"/s/{identifier}"
    if link_type == "conversational":
        path += "/chat"
    return f"{base_url}{path}"


def resolve_template_name(template_name: str) -> str:
    """
    Return the template identifier, falling back to survey_invitation
    if the provided name is not recognised.
    """
    if template_name in VALID_TEMPLATES:
        return template_name
    return TEMPLATE_SURVEY_INVITATION
