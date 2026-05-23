"""
Sentiment Analysis Service.

Classifies the emotional tone of survey responses, produces confidence
scores, and generates aggregated sentiment analytics for dashboard
visualisation.
"""

from __future__ import annotations

import logging
import time

from apps.ai.services import call_gemini, build_sentiment_prompt, parse_json_response
from apps.ai_analytics.constants import (
    MAX_RESPONSES_PER_SUMMARY,
    MAX_RESPONSE_TEXT_LENGTH,
    AI_STATUS_COMPLETED,
    AI_STATUS_FAILED,
    SENTIMENT_NEUTRAL,
    MIN_CONFIDENCE_THRESHOLD,
)

logger = logging.getLogger(__name__)


def _collect_responses_text(survey_id: int) -> list[str]:
    """Collect all textual answer values for a survey."""
    from apps.responses.models import Answer

    answers = (
        Answer.objects
        .filter(question__survey_id=survey_id)
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
        elif isinstance(raw, list):
            # Checkbox / multi-select — join choices as text
            joined = ", ".join(str(v) for v in raw if v)
            if joined:
                texts.append(joined[:MAX_RESPONSE_TEXT_LENGTH])

    return texts


def _normalise_distribution(dist: dict) -> dict:
    """
    Ensure sentiment_distribution sums to 1.0 and contains all three keys.
    Clamps values to [0, 1] and normalises.
    """
    keys = ["positive", "neutral", "negative"]
    cleaned = {k: max(0.0, float(dist.get(k, 0.0))) for k in keys}
    total = sum(cleaned.values())
    if total > 0:
        cleaned = {k: round(v / total, 4) for k, v in cleaned.items()}
    else:
        cleaned = {"positive": 0.0, "neutral": 1.0, "negative": 0.0}
    return cleaned


def analyse_survey_sentiment(survey_id: int, owner_id: int) -> "AISentiment | None":  # type: ignore[name-defined]
    """
    Generate (or regenerate) sentiment analysis for a survey.

    Workflow:
        Response texts → Gemini classification → Confidence score → AISentiment record

    Returns the saved AISentiment instance, or None if an unexpected error occurs.
    """
    from apps.ai_analytics.models import AISentiment
    from apps.surveys.models.survey import Survey

    try:
        survey = Survey.objects.get(pk=survey_id)
    except Survey.DoesNotExist:
        logger.warning("sentiment_service: Survey %s not found", survey_id)
        return None

    texts = _collect_responses_text(survey_id)
    if not texts:
        logger.info("sentiment_service: No responses for survey %s", survey_id)
        obj, _ = AISentiment.objects.update_or_create(
            survey_id=survey_id,
            owner_id=owner_id,
            defaults={
                "sentiment_distribution": {"positive": 0.0, "neutral": 1.0, "negative": 0.0},
                "dominant_sentiment": SENTIMENT_NEUTRAL,
                "overall_confidence": 0.0,
                "reasoning": "No responses available for sentiment analysis.",
                "response_count": 0,
                "status": AI_STATUS_COMPLETED,
                "processing_metadata": {"note": "no_responses"},
            },
        )
        return obj

    sample = texts[:MAX_RESPONSES_PER_SUMMARY]
    prompt = build_sentiment_prompt(responses=sample, survey_title=survey.title)

    start = time.monotonic()
    raw = call_gemini(prompt)
    elapsed = round(time.monotonic() - start, 2)

    parsed = parse_json_response(raw) if raw else None

    if not parsed or not isinstance(parsed, dict):
        logger.warning("sentiment_service: Invalid AI response for survey %s", survey_id)
        obj, _ = AISentiment.objects.update_or_create(
            survey_id=survey_id,
            owner_id=owner_id,
            defaults={
                "sentiment_distribution": {"positive": 0.0, "neutral": 1.0, "negative": 0.0},
                "dominant_sentiment": SENTIMENT_NEUTRAL,
                "overall_confidence": 0.0,
                "reasoning": "",
                "response_count": len(texts),
                "status": AI_STATUS_FAILED,
                "processing_metadata": {
                    "error": "invalid_ai_response",
                    "elapsed_seconds": elapsed,
                },
            },
        )
        return obj

    raw_dist = parsed.get("sentiment_distribution") or {}
    distribution = _normalise_distribution(raw_dist if isinstance(raw_dist, dict) else {})

    dominant = str(parsed.get("dominant_sentiment") or SENTIMENT_NEUTRAL).lower()
    valid_sentiments = {"positive", "neutral", "negative", "mixed"}
    if dominant not in valid_sentiments:
        dominant = SENTIMENT_NEUTRAL

    raw_confidence = parsed.get("confidence") or 0.0
    confidence = max(0.0, min(1.0, float(raw_confidence)))

    reasoning = str(parsed.get("reasoning") or "").strip()

    obj, _ = AISentiment.objects.update_or_create(
        survey_id=survey_id,
        owner_id=owner_id,
        defaults={
            "sentiment_distribution": distribution,
            "dominant_sentiment": dominant,
            "overall_confidence": confidence,
            "reasoning": reasoning,
            "response_count": len(texts),
            "status": AI_STATUS_COMPLETED,
            "processing_metadata": {
                "sample_size": len(sample),
                "total_responses": len(texts),
                "elapsed_seconds": elapsed,
                "low_confidence": confidence < MIN_CONFIDENCE_THRESHOLD,
            },
        },
    )

    logger.info(
        "sentiment_service: Sentiment analysed for survey=%s "
        "dominant=%s confidence=%.2f elapsed=%.2fs",
        survey_id, dominant, confidence, elapsed,
    )
    return obj


def get_or_analyse_sentiment(survey_id: int, owner_id: int) -> "AISentiment | None":
    """Return cached sentiment analysis or generate a new one."""
    from apps.ai_analytics.models import AISentiment

    existing = (
        AISentiment.objects
        .filter(survey_id=survey_id, owner_id=owner_id)
        .order_by("-created_at")
        .first()
    )
    if existing:
        return existing
    return analyse_survey_sentiment(survey_id, owner_id)
