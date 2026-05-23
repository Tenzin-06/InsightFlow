"""
AI Insight Generation Service.

Combines deterministic analytics metrics with AI-generated outputs
to produce structured, actionable intelligence narratives for dashboards.

AI augments analytics — it does not replace measurable metrics.
"""

from __future__ import annotations

import logging

from apps.ai_analytics.constants import (
    QUALITY_SCORE_HIGH_THRESHOLD,
    QUALITY_SCORE_MEDIUM_THRESHOLD,
    HIGH_CONFIDENCE_THRESHOLD,
    MIN_CONFIDENCE_THRESHOLD,
)

logger = logging.getLogger(__name__)


def _get_analytics_metrics(survey_id: int) -> dict:
    """
    Fetch deterministic analytics metrics from the analytics service.
    Returns an empty dict on any failure.
    """
    try:
        from apps.analytics.services.survey_analytics import get_survey_metrics
        return get_survey_metrics(survey_id)
    except Exception as exc:
        logger.warning("insight_generation: analytics metrics unavailable: %s", exc)
        return {}


def _rate_data_quality(quality_obj) -> str:
    """
    Derive a human-readable data quality label from an AIQualityScore.
    """
    if quality_obj is None:
        return "unknown"

    total = quality_obj.response_count
    if total == 0:
        return "unknown"

    suspicious_ratio = quality_obj.suspicious_count / total
    high_ratio = quality_obj.high_quality_count / total

    if suspicious_ratio > 0.3:
        return "low"
    if high_ratio >= 0.6:
        return "high"
    if quality_obj.average_score >= QUALITY_SCORE_HIGH_THRESHOLD:
        return "high"
    if quality_obj.average_score >= QUALITY_SCORE_MEDIUM_THRESHOLD:
        return "medium"
    return "low"


def generate_survey_insights(survey_id: int, owner_id: int) -> dict:
    """
    Build a structured insights payload for a survey by combining:
    - Deterministic analytics metrics
    - AI-generated summary
    - AI sentiment
    - AI quality scores

    Returns a dashboard-ready insights dict.
    """
    from apps.ai_analytics.models import AISummary, AISentiment, AIQualityScore

    # Load analytics metrics
    metrics = _get_analytics_metrics(survey_id)

    # Load AI outputs (may be None if not yet generated)
    summary_obj = (
        AISummary.objects
        .filter(survey_id=survey_id, owner_id=owner_id)
        .order_by("-created_at")
        .first()
    )
    sentiment_obj = (
        AISentiment.objects
        .filter(survey_id=survey_id, owner_id=owner_id)
        .order_by("-created_at")
        .first()
    )
    quality_obj = (
        AIQualityScore.objects
        .filter(survey_id=survey_id, owner_id=owner_id)
        .order_by("-created_at")
        .first()
    )

    # Key findings
    key_findings: list[str] = []

    total_responses = int(metrics.get("total_responses", 0))
    if total_responses > 0:
        key_findings.append(f"{total_responses} responses collected.")

    if sentiment_obj and sentiment_obj.overall_confidence >= MIN_CONFIDENCE_THRESHOLD:
        dist = sentiment_obj.sentiment_distribution or {}
        pos_pct = round(dist.get("positive", 0.0) * 100)
        neg_pct = round(dist.get("negative", 0.0) * 100)
        if pos_pct > 60:
            key_findings.append(f"{pos_pct}% of responses carry a positive tone.")
        elif neg_pct > 40:
            key_findings.append(f"{neg_pct}% of responses express negative sentiment.")

    if summary_obj and summary_obj.themes:
        top_themes = summary_obj.themes[:3]
        if top_themes:
            key_findings.append(f"Top themes: {', '.join(top_themes)}.")

    if quality_obj and quality_obj.response_count > 0:
        if quality_obj.suspicious_count > 0:
            key_findings.append(
                f"{quality_obj.suspicious_count} suspicious response(s) detected."
            )
        if quality_obj.average_score >= QUALITY_SCORE_HIGH_THRESHOLD:
            key_findings.append(
                f"Overall response quality is high (avg score: {quality_obj.average_score:.0f}/100)."
            )

    # Sentiment confidence label
    sentiment_confidence_label = "unknown"
    if sentiment_obj:
        c = sentiment_obj.overall_confidence
        if c >= HIGH_CONFIDENCE_THRESHOLD:
            sentiment_confidence_label = "high"
        elif c >= MIN_CONFIDENCE_THRESHOLD:
            sentiment_confidence_label = "medium"
        else:
            sentiment_confidence_label = "low"

    data_quality_label = _rate_data_quality(quality_obj)

    return {
        "total_responses": total_responses,
        "completion_rate": float(metrics.get("completion_rate", 0.0)),
        "key_findings": key_findings,
        "data_quality": data_quality_label,
        "sentiment_confidence": sentiment_confidence_label,
        "ai_summary_available": summary_obj is not None and bool(summary_obj.summary),
        "ai_sentiment_available": sentiment_obj is not None,
        "ai_quality_available": quality_obj is not None,
    }
