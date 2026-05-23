"""
Question-Level Insight Service.

Generates AI insights for individual survey questions,
including theme identification, sentiment summaries,
friction indicators, and answer diversity analysis.
"""

from __future__ import annotations

import logging
import time

from apps.ai.services import call_gemini, build_question_insight_prompt, parse_json_response
from apps.ai_analytics.constants import (
    MAX_RESPONSES_PER_SUMMARY,
    MAX_RESPONSE_TEXT_LENGTH,
    AI_STATUS_COMPLETED,
    AI_STATUS_FAILED,
)

logger = logging.getLogger(__name__)


def _collect_answers_by_question(survey_id: int) -> list[dict]:
    """
    Group answer texts by question for the survey.

    Returns:
        [
            {
                "question_id": int,
                "question_text": str,
                "question_type": str,
                "order": int,
                "answers": [str, ...],
            },
            ...
        ]
    """
    from apps.surveys.models.question import Question
    from apps.responses.models.answer import Answer

    questions = (
        Question.objects
        .filter(survey_id=survey_id)
        .order_by("order")
    )

    result: list[dict] = []
    for question in questions:
        answers_qs = (
            Answer.objects
            .filter(question=question)
            .order_by("response_id")[:MAX_RESPONSES_PER_SUMMARY]
        )

        texts: list[str] = []
        for answer in answers_qs:
            raw = answer.value
            if isinstance(raw, str) and raw.strip():
                texts.append(raw.strip()[:MAX_RESPONSE_TEXT_LENGTH])
            elif isinstance(raw, dict):
                text = raw.get("text") or raw.get("value") or ""
                if isinstance(text, str) and text.strip():
                    texts.append(text.strip()[:MAX_RESPONSE_TEXT_LENGTH])
            elif isinstance(raw, (int, float)):
                texts.append(str(raw))
            elif isinstance(raw, list):
                joined = ", ".join(str(v) for v in raw if v)
                if joined:
                    texts.append(joined[:MAX_RESPONSE_TEXT_LENGTH])

        result.append(
            {
                "question_id": question.id,
                "question_text": question.question_text,
                "question_type": question.question_type,
                "order": question.order,
                "answers": texts,
            }
        )

    return result


def analyse_survey_questions(
    survey_id: int, owner_id: int
) -> list["AIQuestionInsight"]:  # type: ignore[name-defined]
    """
    Generate (or regenerate) per-question insights for a survey.

    For each question, submits a prompt to Gemini and stores the
    result in an AIQuestionInsight record.

    Returns the list of saved AIQuestionInsight instances.
    """
    from apps.ai_analytics.models import AIQuestionInsight
    from apps.surveys.models.survey import Survey

    try:
        Survey.objects.get(pk=survey_id)
    except Survey.DoesNotExist:
        logger.warning("question_analysis_service: Survey %s not found", survey_id)
        return []

    question_data = _collect_answers_by_question(survey_id)
    if not question_data:
        logger.info(
            "question_analysis_service: No questions for survey %s", survey_id
        )
        return []

    saved: list[AIQuestionInsight] = []

    for qdata in question_data:
        question_id = qdata["question_id"]
        question_text = qdata["question_text"]
        answers = qdata["answers"]

        if not answers:
            # No answers — store an empty insight record
            obj, _ = AIQuestionInsight.objects.update_or_create(
                survey_id=survey_id,
                question_id=question_id,
                owner_id=owner_id,
                defaults={
                    "question_text": question_text,
                    "themes": [],
                    "sentiment_summary": "No answers available.",
                    "friction_indicators": [],
                    "answer_diversity": {
                        "description": "No answers collected.",
                        "diversity_level": "low",
                    },
                    "answer_count": 0,
                    "status": AI_STATUS_COMPLETED,
                    "processing_metadata": {"note": "no_answers"},
                },
            )
            saved.append(obj)
            continue

        prompt = build_question_insight_prompt(
            question_text=question_text,
            answers=answers,
        )

        start = time.monotonic()
        raw = call_gemini(prompt)
        elapsed = round(time.monotonic() - start, 2)

        parsed = parse_json_response(raw) if raw else None

        if not parsed or not isinstance(parsed, dict):
            logger.warning(
                "question_analysis_service: Invalid AI response for "
                "survey=%s question=%s",
                survey_id, question_id,
            )
            obj, _ = AIQuestionInsight.objects.update_or_create(
                survey_id=survey_id,
                question_id=question_id,
                owner_id=owner_id,
                defaults={
                    "question_text": question_text,
                    "themes": [],
                    "sentiment_summary": "",
                    "friction_indicators": [],
                    "answer_diversity": {},
                    "answer_count": len(answers),
                    "status": AI_STATUS_FAILED,
                    "processing_metadata": {
                        "error": "invalid_ai_response",
                        "elapsed_seconds": elapsed,
                    },
                },
            )
            saved.append(obj)
            continue

        themes_raw = parsed.get("themes") or []
        themes = (
            [str(t).strip() for t in themes_raw if t]
            if isinstance(themes_raw, list)
            else []
        )

        sentiment_summary = str(parsed.get("sentiment_summary") or "").strip()

        friction_raw = parsed.get("friction_indicators") or []
        friction = (
            [str(f).strip() for f in friction_raw if f]
            if isinstance(friction_raw, list)
            else []
        )

        diversity_raw = parsed.get("answer_diversity") or {}
        if not isinstance(diversity_raw, dict):
            diversity_raw = {}
        diversity = {
            "description": str(diversity_raw.get("description") or "").strip(),
            "diversity_level": str(
                diversity_raw.get("diversity_level") or "medium"
            ).lower(),
        }
        if diversity["diversity_level"] not in {"high", "medium", "low"}:
            diversity["diversity_level"] = "medium"

        obj, _ = AIQuestionInsight.objects.update_or_create(
            survey_id=survey_id,
            question_id=question_id,
            owner_id=owner_id,
            defaults={
                "question_text": question_text,
                "themes": themes,
                "sentiment_summary": sentiment_summary,
                "friction_indicators": friction,
                "answer_diversity": diversity,
                "answer_count": len(answers),
                "status": AI_STATUS_COMPLETED,
                "processing_metadata": {
                    "elapsed_seconds": elapsed,
                    "answer_count": len(answers),
                },
            },
        )
        saved.append(obj)

    logger.info(
        "question_analysis_service: Insights generated for survey=%s questions=%d",
        survey_id, len(saved),
    )
    return saved


def get_or_analyse_questions(
    survey_id: int, owner_id: int
) -> list["AIQuestionInsight"]:
    """Return existing question insights or generate new ones."""
    from apps.ai_analytics.models import AIQuestionInsight

    existing = list(
        AIQuestionInsight.objects
        .filter(survey_id=survey_id, owner_id=owner_id)
        .order_by("question__order")
    )
    if existing:
        return existing
    return analyse_survey_questions(survey_id, owner_id)
