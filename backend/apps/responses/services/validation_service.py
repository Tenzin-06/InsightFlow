from apps.surveys.models.question import (
    Question,
    QUESTION_TYPE_RATING,
    QUESTION_TYPE_CHECKBOX,
)
from apps.responses.constants import SUPPORTED_QUESTION_TYPES
from apps.responses.exceptions import SubmissionValidationError


def validate_submission(survey, answers_data: list[dict]) -> None:
    """
    Validate a full submission against the survey's question set.

    Checks:
    - Each submitted question_id belongs to the survey.
    - Each question type is supported.
    - Answer values match their question type (rating = numeric, checkbox = list).
    - All required questions have been answered.

    Raises SubmissionValidationError on the first violation found.
    """
    survey_questions: dict[int, Question] = {
        q.id: q for q in Question.objects.filter(survey=survey)
    }
    submitted_ids: set[int] = {a["question_id"] for a in answers_data}

    for answer_data in answers_data:
        question_id = answer_data["question_id"]
        value = answer_data["value"]

        # Question must belong to this survey
        if question_id not in survey_questions:
            raise SubmissionValidationError(
                f"Question {question_id} does not belong to this survey."
            )

        question = survey_questions[question_id]

        # Question type must be in the supported set
        if question.question_type not in SUPPORTED_QUESTION_TYPES:
            raise SubmissionValidationError(
                f"Question type '{question.question_type}' is not supported."
            )

        # Type-specific value validation
        _validate_answer_value(question, value)

    # All required questions must have a submitted answer
    for question_id, question in survey_questions.items():
        if question.is_required and question_id not in submitted_ids:
            raise SubmissionValidationError(
                f"Required question was not answered: '{question.question_text[:80]}'."
            )


def _validate_answer_value(question: Question, value) -> None:
    """Validate that the answer value matches the expected format for the question type."""
    q_type = question.question_type

    if q_type == QUESTION_TYPE_RATING:
        if not isinstance(value, (int, float)):
            raise SubmissionValidationError(
                f"Answer for question {question.id} must be a numeric rating value, "
                f"got '{type(value).__name__}'."
            )

    elif q_type == QUESTION_TYPE_CHECKBOX:
        if not isinstance(value, list):
            raise SubmissionValidationError(
                f"Answer for question {question.id} must be a list of selected options, "
                f"got '{type(value).__name__}'."
            )
