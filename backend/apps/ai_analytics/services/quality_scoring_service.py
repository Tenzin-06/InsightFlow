"""
Quality Scoring Service.

Evaluates response quality and completeness using AI, detecting
low-quality submissions and suspicious patterns.
"""

from __future__ import annotations

import logging
import time

from apps.ai.services import call_gemini, build_quality_scoring_prompt, parse_json_response
from apps.ai_analytics.constants import (
    MAX_RESPONSES_PER_QUALITY_BATCH,
    MAX_RESPONSE_TEXT_LENGTH,
    QUALITY_CATEGORY_HIGH,
    QUALITY_CATEGORY_MEDIUM,
    QUALITY_CATEGORY_LOW,
    QUALITY_CATEGORY_SUSPICIOUS,
    QUALITY_SCORE_HIGH_THRESHOLD,
    QUALITY_SCORE_MEDIUM_THRESHOLD,
    AI_STATUS_COMPLETED,
    AI_STATUS_FAILED,
)

logger = logging.getLogger(__name__)


def _collect_responses(survey_id: int) -> list[dict]:
    """
    Collect all responses for the survey, returning a list of
    {"response_id": int, "text": str} dicts.
    """
    from apps.responses.models.response import Response
    from apps.responses.models.answer import Answer

    responses = (
        Response.objects
        .filter(survey_id=survey_id)
        .prefetch_related("answers__question")
        .order_by("id")
    )

    result: list[dict] = []
    for resp in responses:
        parts: list[str] = []
        for answer in resp.answers.all():
            raw = answer.value
            if isinstance(raw, str) and raw.strip():
                parts.append(raw.strip()[:MAX_RESPONSE_TEXT_LENGTH])
            elif isinstance(raw, dict):
                text = raw.get("text") or raw.get("value") or ""
                if isinstance(text, str) and text.strip():
                    parts.append(text.strip()[:MAX_RESPONSE_TEXT_LENGTH])
            elif isinstance(raw, list):
                joined = ", ".join(str(v) for v in raw if v)
                if joined:
                    parts.append(joined[:MAX_RESPONSE_TEXT_LENGTH])

        combined = " | ".join(parts)
        if combined:
            result.append({"response_id": resp.id, "text": combined})

    return result


def _categorise_score(score: int) -> str:
    if score >= QUALITY_SCORE_HIGH_THRESHOLD:
        return QUALITY_CATEGORY_HIGH
    if score >= QUALITY_SCORE_MEDIUM_THRESHOLD:
        return QUALITY_CATEGORY_MEDIUM
    return QUALITY_CATEGORY_LOW


def score_survey_quality(survey_id: int, owner_id: int) -> "AIQualityScore | None":  # type: ignore[name-defined]
    """
    Generate (or regenerate) quality scores for a survey's responses.

    Processes responses in batches (MAX_RESPONSES_PER_QUALITY_BATCH),
    then aggregates counts and average score.

    Returns the saved AIQualityScore instance, or None on error.
    """
    from apps.ai_analytics.models import AIQualityScore
    from apps.surveys.models.survey import Survey

    try:
        survey = Survey.objects.get(pk=survey_id)
    except Survey.DoesNotExist:
        logger.warning("quality_service: Survey %s not found", survey_id)
        return None

    all_responses = _collect_responses(survey_id)
    if not all_responses:
        logger.info("quality_service: No responses for survey %s", survey_id)
        obj, _ = AIQualityScore.objects.update_or_create(
            survey_id=survey_id,
            owner_id=owner_id,
            defaults={
                "average_score": 0.0,
                "high_quality_count": 0,
                "medium_quality_count": 0,
                "low_quality_count": 0,
                "suspicious_count": 0,
                "response_count": 0,
                "score_breakdown": [],
                "status": AI_STATUS_COMPLETED,
                "processing_metadata": {"note": "no_responses"},
            },
        )
        return obj

    # Process in batches
    all_scores: list[dict] = []
    total_start = time.monotonic()

    for i in range(0, len(all_responses), MAX_RESPONSES_PER_QUALITY_BATCH):
        batch = all_responses[i : i + MAX_RESPONSES_PER_QUALITY_BATCH]
        prompt = build_quality_scoring_prompt(batch)
        if not prompt:
            continue

        raw = call_gemini(prompt)
        parsed = parse_json_response(raw) if raw else None

        if parsed and isinstance(parsed, dict):
            scores_raw = parsed.get("scores") or []
            if isinstance(scores_raw, list):
                for item in scores_raw:
                    if not isinstance(item, dict):
                        continue
                    resp_id = item.get("response_id")
                    score_val = item.get("score")
                    category = item.get("category") or ""
                    flags = item.get("flags") or []

                    if resp_id is None or score_val is None:
                        continue

                    score_int = max(0, min(100, int(float(score_val))))
                    # Validate / normalise category
                    valid_cats = {
                        QUALITY_CATEGORY_HIGH,
                        QUALITY_CATEGORY_MEDIUM,
                        QUALITY_CATEGORY_LOW,
                        QUALITY_CATEGORY_SUSPICIOUS,
                    }
                    if category not in valid_cats:
                        category = _categorise_score(score_int)

                    all_scores.append(
                        {
                            "response_id": resp_id,
                            "score": score_int,
                            "category": category,
                            "flags": flags if isinstance(flags, list) else [],
                        }
                    )
        else:
            logger.warning(
                "quality_service: Invalid AI response for batch %d/%d survey=%s",
                i // MAX_RESPONSES_PER_QUALITY_BATCH + 1,
                (len(all_responses) + MAX_RESPONSES_PER_QUALITY_BATCH - 1)
                // MAX_RESPONSES_PER_QUALITY_BATCH,
                survey_id,
            )

    elapsed = round(time.monotonic() - total_start, 2)

    # Aggregate counts
    high = sum(1 for s in all_scores if s["category"] == QUALITY_CATEGORY_HIGH)
    medium = sum(1 for s in all_scores if s["category"] == QUALITY_CATEGORY_MEDIUM)
    low = sum(1 for s in all_scores if s["category"] == QUALITY_CATEGORY_LOW)
    suspicious = sum(1 for s in all_scores if s["category"] == QUALITY_CATEGORY_SUSPICIOUS)

    numeric_scores = [s["score"] for s in all_scores if s["category"] != QUALITY_CATEGORY_SUSPICIOUS]
    avg_score = round(sum(numeric_scores) / len(numeric_scores), 1) if numeric_scores else 0.0

    status = AI_STATUS_COMPLETED if all_scores else AI_STATUS_FAILED

    obj, _ = AIQualityScore.objects.update_or_create(
        survey_id=survey_id,
        owner_id=owner_id,
        defaults={
            "average_score": avg_score,
            "high_quality_count": high,
            "medium_quality_count": medium,
            "low_quality_count": low,
            "suspicious_count": suspicious,
            "response_count": len(all_responses),
            "score_breakdown": all_scores,
            "status": status,
            "processing_metadata": {
                "total_responses": len(all_responses),
                "scored_responses": len(all_scores),
                "elapsed_seconds": elapsed,
            },
        },
    )

    logger.info(
        "quality_service: Quality scored for survey=%s "
        "avg=%.1f high=%d medium=%d low=%d suspicious=%d elapsed=%.2fs",
        survey_id, avg_score, high, medium, low, suspicious, elapsed,
    )
    return obj


def get_or_score_quality(survey_id: int, owner_id: int) -> "AIQualityScore | None":
    """Return cached quality score or generate a new one."""
    from apps.ai_analytics.models import AIQualityScore

    existing = (
        AIQualityScore.objects
        .filter(survey_id=survey_id, owner_id=owner_id)
        .order_by("-created_at")
        .first()
    )
    if existing:
        return existing
    return score_survey_quality(survey_id, owner_id)
