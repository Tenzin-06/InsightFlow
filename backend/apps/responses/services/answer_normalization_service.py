from apps.surveys.models.question import (
    Question,
    QUESTION_TYPE_SHORT_TEXT,
    QUESTION_TYPE_LONG_TEXT,
    QUESTION_TYPE_MULTIPLE_CHOICE,
    QUESTION_TYPE_CHECKBOX,
    QUESTION_TYPE_RATING,
)


def normalize_answers(
    answers_data: list[dict],
    survey_questions: dict[int, Question],
) -> list[dict]:
    """
    Normalize raw frontend answer payloads into analytics-ready structures.

    Workflow:
      Frontend Payload → Normalize Structure → Validate → Persist

    Returns a list of normalized answer dicts, each containing:
      - question_id
      - value (normalized)
      - metadata
    """
    return [
        _normalize_single(answer_data, survey_questions[answer_data["question_id"]])
        for answer_data in answers_data
    ]


def _normalize_single(answer_data: dict, question: Question) -> dict:
    """Normalize a single answer value based on its question type."""
    raw_value = answer_data["value"]
    q_type = question.question_type

    if q_type in (QUESTION_TYPE_SHORT_TEXT, QUESTION_TYPE_LONG_TEXT):
        # Sanitize: coerce to string and strip surrounding whitespace
        normalized = str(raw_value).strip() if raw_value is not None else ""

    elif q_type == QUESTION_TYPE_MULTIPLE_CHOICE:
        # Single selection: normalize to a clean string
        normalized = str(raw_value).strip() if raw_value is not None else ""

    elif q_type == QUESTION_TYPE_CHECKBOX:
        # Multi-selection: normalize each item in the list
        normalized = (
            [str(item).strip() for item in raw_value]
            if isinstance(raw_value, list)
            else []
        )

    elif q_type == QUESTION_TYPE_RATING:
        # Rating: ensure stored as integer when a whole-number float is provided
        normalized = (
            int(raw_value) if isinstance(raw_value, float) and raw_value.is_integer()
            else raw_value
        )

    else:
        # Unknown supported type: store as-is
        normalized = raw_value

    return {
        "question_id": answer_data["question_id"],
        "value": normalized,
        "metadata": answer_data.get("metadata", {}),
    }
