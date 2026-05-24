import logging

from apps.google_forms_import.types import NormalizedForm, NormalizedQuestion, RawForm, RawQuestion
from apps.google_forms_import.utils.question_mapper import map_question_type

logger = logging.getLogger(__name__)


def _normalize_question(raw: RawQuestion, order: int) -> NormalizedQuestion | None:
    if_type = map_question_type(raw["gf_type"])
    if if_type is None:
        logger.info(
            "Skipping unsupported Google Forms question type %d: '%s'",
            raw["gf_type"],
            raw["title"],
        )
        return None

    metadata: dict = {}
    if if_type in ("multiple_choice", "checkbox") and raw["options"]:
        # Key must be "choices" — that's what the survey editor (InlineQuestionCard)
        # reads from metadata when rendering options.
        metadata["choices"] = raw["options"]
    elif if_type == "rating":
        metadata["min_rating"] = raw["min_value"] if raw["min_value"] is not None else 1
        metadata["max_rating"] = raw["max_value"] if raw["max_value"] is not None else 5

    return NormalizedQuestion(
        question_text=raw["title"],
        question_type=if_type,
        is_required=raw["required"],
        order=order,
        metadata=metadata,
    )


def normalize_form(raw_form: RawForm) -> NormalizedForm:
    normalized: list[NormalizedQuestion] = []
    order = 1
    for raw_q in raw_form["questions"]:
        result = _normalize_question(raw_q, order)
        if result is not None:
            normalized.append(result)
            order += 1

    total = len(raw_form["questions"])
    accepted = len(normalized)
    if total != accepted:
        logger.info(
            "Normalization: accepted %d of %d questions (%d unsupported type(s) skipped)",
            accepted,
            total,
            total - accepted,
        )

    return NormalizedForm(
        title=raw_form["title"],
        description=raw_form["description"],
        questions=normalized,
    )
