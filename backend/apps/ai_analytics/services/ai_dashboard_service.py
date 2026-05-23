"""
AI Dashboard Service.

Prepares frontend-ready AI insight payloads, combining AI-generated
analytics with metrics for dashboard widget rendering.

Dashboard sections:
    - AI Summary    → overall insights + themes
    - Sentiment     → emotional analytics distribution
    - Key Themes    → common patterns
    - Quality       → data reliability indicators
"""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


def _serialise_summary(obj) -> dict:
    if obj is None:
        return {"available": False, "summary": "", "themes": [], "response_count": 0}
    return {
        "available": bool(obj.summary),
        "summary": obj.summary,
        "themes": obj.themes or [],
        "response_count": obj.response_count,
        "generated_at": obj.updated_at.isoformat() if obj.updated_at else None,
        "status": obj.status,
    }


def _serialise_sentiment(obj) -> dict:
    if obj is None:
        return {
            "available": False,
            "dominant_sentiment": None,
            "sentiment_distribution": {},
            "overall_confidence": 0.0,
            "reasoning": "",
            "response_count": 0,
        }
    return {
        "available": True,
        "dominant_sentiment": obj.dominant_sentiment,
        "sentiment_distribution": obj.sentiment_distribution or {},
        "overall_confidence": obj.overall_confidence,
        "reasoning": obj.reasoning,
        "response_count": obj.response_count,
        "generated_at": obj.updated_at.isoformat() if obj.updated_at else None,
    }


def _serialise_quality(obj) -> dict:
    if obj is None:
        return {
            "available": False,
            "average_score": 0.0,
            "high_quality_count": 0,
            "medium_quality_count": 0,
            "low_quality_count": 0,
            "suspicious_count": 0,
            "response_count": 0,
        }
    return {
        "available": True,
        "average_score": obj.average_score,
        "high_quality_count": obj.high_quality_count,
        "medium_quality_count": obj.medium_quality_count,
        "low_quality_count": obj.low_quality_count,
        "suspicious_count": obj.suspicious_count,
        "response_count": obj.response_count,
        "generated_at": obj.updated_at.isoformat() if obj.updated_at else None,
    }


def _serialise_question_insight(obj) -> dict:
    return {
        "question_id": obj.question_id,
        "question_text": obj.question_text,
        "themes": obj.themes or [],
        "sentiment_summary": obj.sentiment_summary,
        "friction_indicators": obj.friction_indicators or [],
        "answer_diversity": obj.answer_diversity or {},
        "answer_count": obj.answer_count,
        "generated_at": obj.updated_at.isoformat() if obj.updated_at else None,
    }


def get_ai_dashboard_payload(survey_id: int, owner_id: int) -> dict:
    """
    Build the complete AI analytics payload for a survey dashboard.

    Aggregates AI Summary, Sentiment, Quality, and Question Insights
    into a single frontend-ready response.

    Structure:
        {
            "ai_summary": {...},
            "sentiment": {...},
            "quality": {...},
            "question_insights": [...],
            "combined_insights": {...},
        }
    """
    from apps.ai_analytics.models import (
        AISummary,
        AISentiment,
        AIQualityScore,
        AIQuestionInsight,
    )
    from apps.ai_analytics.services.insight_generation_service import (
        generate_survey_insights,
    )

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
    question_insights = list(
        AIQuestionInsight.objects
        .filter(survey_id=survey_id, owner_id=owner_id)
        .order_by("question__order")
    )

    combined_insights = generate_survey_insights(survey_id, owner_id)

    return {
        "ai_summary": _serialise_summary(summary_obj),
        "sentiment": _serialise_sentiment(sentiment_obj),
        "quality": _serialise_quality(quality_obj),
        "question_insights": [
            _serialise_question_insight(q) for q in question_insights
        ],
        "combined_insights": combined_insights,
    }
