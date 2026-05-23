import logging

from django.db import transaction

from apps.surveys.models.question import Question
from apps.surveys.models.survey import Survey
from apps.google_forms_import.exceptions import SurveyCreationError
from apps.google_forms_import.types import NormalizedForm

logger = logging.getLogger(__name__)


def build_survey_from_normalized_form(owner, normalized_form: NormalizedForm) -> Survey:
    try:
        with transaction.atomic():
            survey = Survey.objects.create(
                owner=owner,
                title=normalized_form["title"],
                description=normalized_form["description"],
                status="draft",
                is_public=False,
            )
            questions = [
                Question(
                    survey=survey,
                    question_text=q["question_text"],
                    question_type=q["question_type"],
                    is_required=q["is_required"],
                    order=q["order"],
                    metadata=q["metadata"],
                )
                for q in normalized_form["questions"]
            ]
            Question.objects.bulk_create(questions)
            logger.info(
                "Created survey id=%d with %d question(s) for user id=%d",
                survey.pk,
                len(questions),
                owner.pk,
            )
            return survey
    except Exception as exc:
        raise SurveyCreationError(f"Failed to persist imported survey: {exc}") from exc
