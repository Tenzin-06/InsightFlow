from django.db import transaction

from apps.surveys.models.question import Question
from apps.responses.models.response import Response
from apps.responses.models.answer import Answer
from apps.responses.services.validation_service import validate_submission
from apps.responses.services.answer_normalization_service import normalize_answers


def submit_survey_response(
    survey,
    answers_data: list[dict],
    respondent=None,
    metadata: dict | None = None,
) -> Response:
    """
    Validate, normalize, and atomically persist a survey submission.

    Workflow:
      Validate Submission
      → Normalize Answers
      → Create Response (atomic transaction)
      → Bulk-create Answers
      → Return created Response instance

    Raises SubmissionValidationError if validation fails (no DB writes occur).
    Any DB error causes a full rollback via transaction.atomic().
    """
    if metadata is None:
        metadata = {}

    # --- Validate first (no DB writes at this stage) ---
    validate_submission(survey, answers_data)

    # --- Load question objects needed for normalization ---
    question_ids = [a["question_id"] for a in answers_data]
    survey_questions: dict[int, Question] = {
        q.id: q
        for q in Question.objects.filter(id__in=question_ids, survey=survey)
    }

    # --- Normalize answers ---
    normalized_answers = normalize_answers(answers_data, survey_questions)

    # --- Persist atomically: response + all answers in one transaction ---
    with transaction.atomic():
        response = Response.objects.create(
            survey=survey,
            respondent=respondent,
            metadata=metadata,
        )

        Answer.objects.bulk_create([
            Answer(
                response=response,
                question_id=a["question_id"],
                value=a["value"],
                metadata=a.get("metadata", {}),
            )
            for a in normalized_answers
        ])

    return response
