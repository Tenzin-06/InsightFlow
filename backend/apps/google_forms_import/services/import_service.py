import logging

from apps.google_forms_import.exceptions import GoogleFormsImportError
from apps.google_forms_import.services.normalization_service import normalize_form
from apps.google_forms_import.services.parser_service import fetch_form_html, parse_form
from apps.google_forms_import.services.survey_builder_service import build_survey_from_normalized_form
from apps.google_forms_import.services.validation_service import validate_google_forms_url

logger = logging.getLogger(__name__)


def import_google_form(url: str, owner) -> dict:
    logger.info("Starting Google Forms import — user id=%d url=%s", owner.pk, url)

    validated_url = validate_google_forms_url(url)
    html = fetch_form_html(validated_url)
    raw_form = parse_form(html)
    normalized_form = normalize_form(raw_form)
    survey = build_survey_from_normalized_form(owner, normalized_form)

    logger.info(
        "Google Forms import complete — survey id=%d user id=%d",
        survey.pk,
        owner.pk,
    )
    return {
        "survey_id": survey.pk,
        "title": survey.title,
        "question_count": survey.questions.count(),
    }
