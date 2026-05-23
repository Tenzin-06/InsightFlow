"""
Response Summarization Service.

Generates AI-powered summaries from survey open-ended responses,
identifies recurring themes, and produces dashboard-friendly insights.
"""

from __future__ import annotations

import logging
import time

from apps.ai.services import call_gemini, build_summarization_prompt, parse_json_response
from apps.ai_analytics.constants import (
    MAX_RESPONSES_PER_SUMMARY,
    MAX_RESPONSE_TEXT_LENGTH,
    AI_STATUS_COMPLETED,
    AI_STATUS_FAILED,
)

logger = logging.getLogger(__name__)


def _collect_text_responses(survey_id: int) -> list[str]:
    """
    Fetch all open-ended (text) answers for the survey.
    Returns a list of non-empty response strings.
    """
    from apps.responses.models import Answer

    answers = (
        Answer.objects
        .filter(question__survey_id=survey_id)
        .filter(question__question_type__in=["short_text", "long_text"])
        .select_related("question")
        .order_by("response_id")
    )

    texts: list[str] = []
    for answer in answers:
        raw = answer.value
        if isinstance(raw, str) and raw.strip():
            texts.append(raw.strip()[:MAX_RESPONSE_TEXT_LENGTH])
        elif isinstance(raw, dict):
            text = raw.get("text") or raw.get("value") or ""
            if isinstance(text, str) and text.strip():
                texts.append(text.strip()[:MAX_RESPONSE_TEXT_LENGTH])

    return texts


def generate_survey_summary(survey_id: int, owner_id: int) -> "AISummary | None":  # type: ignore[name-defined]
    """
    Generate (or regenerate) an AI summary for a survey's responses.

    Workflow:
        Survey responses → Gemini prompt → Structured summary → AISummary record

    Returns the saved AISummary instance, or None if generation fails.
    """
    from apps.ai_analytics.models import AISummary
    from apps.surveys.models.survey import Survey

    try:
        survey = Survey.objects.get(pk=survey_id)
    except Survey.DoesNotExist:
        logger.warning("summarization_service: Survey %s not found", survey_id)
        return None

    texts = _collect_text_responses(survey_id)
    if not texts:
        logger.info("summarization_service: No text responses for survey %s", survey_id)
        # Return a minimal "no data" summary record
        summary_obj, _ = AISummary.objects.update_or_create(
            survey_id=survey_id,
            owner_id=owner_id,
            defaults={
                "summary": "No open-ended responses available for summarisation.",
                "themes": [],
                "response_count": 0,
                "status": AI_STATUS_COMPLETED,
                "processing_metadata": {"note": "no_text_responses"},
            },
        )
        return summary_obj

    # Truncate to the processing limit
    sample = texts[:MAX_RESPONSES_PER_SUMMARY]

    prompt = build_summarization_prompt(
        responses=sample,
        survey_title=survey.title,
    )

    start = time.monotonic()
    raw_response = call_gemini(prompt)
    elapsed = round(time.monotonic() - start, 2)

    parsed = parse_json_response(raw_response) if raw_response else None

    if not parsed or not isinstance(parsed, dict):
        logger.warning(
            "summarization_service: AI response invalid for survey %s", survey_id
        )
        summary_obj, _ = AISummary.objects.update_or_create(
            survey_id=survey_id,
            owner_id=owner_id,
            defaults={
                "summary": "",
                "themes": [],
                "response_count": len(texts),
                "status": AI_STATUS_FAILED,
                "processing_metadata": {
                    "error": "invalid_ai_response",
                    "elapsed_seconds": elapsed,
                },
            },
        )
        return summary_obj

    summary_text = str(parsed.get("summary") or "").strip()
    themes_raw = parsed.get("themes") or []
    themes = [str(t).strip() for t in themes_raw if t] if isinstance(themes_raw, list) else []

    summary_obj, _ = AISummary.objects.update_or_create(
        survey_id=survey_id,
        owner_id=owner_id,
        defaults={
            "summary": summary_text,
            "themes": themes,
            "response_count": len(texts),
            "status": AI_STATUS_COMPLETED,
            "processing_metadata": {
                "sample_size": len(sample),
                "total_responses": len(texts),
                "elapsed_seconds": elapsed,
            },
        },
    )

    logger.info(
        "summarization_service: Summary generated for survey=%s "
        "themes=%d elapsed=%.2fs",
        survey_id, len(themes), elapsed,
    )
    return summary_obj


def get_or_generate_summary(survey_id: int, owner_id: int) -> "AISummary | None":
    """
    Return the most recent AISummary for the survey, generating one if absent.
    """
    from apps.ai_analytics.models import AISummary

    existing = (
        AISummary.objects
        .filter(survey_id=survey_id, owner_id=owner_id)
        .order_by("-created_at")
        .first()
    )
    if existing:
        return existing

    return generate_survey_summary(survey_id, owner_id)
