"""
AI Analytics API Views.

GET /api/v1/ai-analytics/summary/<survey_id>/
GET /api/v1/ai-analytics/sentiment/<survey_id>/
GET /api/v1/ai-analytics/quality/<survey_id>/
GET /api/v1/ai-analytics/questions/<survey_id>/

All endpoints:
- require authentication
- enforce survey ownership
- return cached data when available
- trigger synchronous AI generation when no data exists
- never block dashboard rendering (errors return 200 with empty state)
"""

from __future__ import annotations

import logging

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.permissions import IsAuthenticated
from apps.ai_analytics.validators import validate_survey_ownership
from apps.ai_analytics.utils import success_response, error_response
from apps.ai_analytics.services import (
    get_or_generate_summary,
    get_or_analyse_sentiment,
    get_or_score_quality,
    get_or_analyse_questions,
    get_summary_cache,
    set_summary_cache,
    get_sentiment_cache,
    set_sentiment_cache,
    get_quality_cache,
    set_quality_cache,
    get_question_insights_cache,
    set_question_insights_cache,
)
from apps.ai_analytics.services.ai_dashboard_service import (
    _serialise_summary,
    _serialise_sentiment,
    _serialise_quality,
    _serialise_question_insight,
)

logger = logging.getLogger(__name__)


class AISummaryView(APIView):
    """
    GET /api/v1/ai-analytics/summary/<survey_id>/

    Returns the AI-generated summary for a survey's open-ended responses.
    Generates one synchronously if none exists.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, survey_id: int) -> Response:
        owner_id = request.user.id

        try:
            validate_survey_ownership(survey_id, owner_id)
        except Exception as exc:
            return Response(error_response(str(exc), "SURVEY_ACCESS_ERROR"), status=404)

        # Cache check
        cached = get_summary_cache(survey_id)
        if cached is not None:
            return Response(success_response(cached))

        try:
            summary_obj = get_or_generate_summary(survey_id, owner_id)
        except Exception as exc:
            logger.exception("AISummaryView error survey=%s: %s", survey_id, exc)
            return Response(
                success_response({"available": False, "summary": "", "themes": [], "response_count": 0}),
            )

        payload = _serialise_summary(summary_obj)
        set_summary_cache(survey_id, payload)
        return Response(success_response(payload))


class AISentimentView(APIView):
    """
    GET /api/v1/ai-analytics/sentiment/<survey_id>/

    Returns AI sentiment analysis for a survey's responses.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, survey_id: int) -> Response:
        owner_id = request.user.id

        try:
            validate_survey_ownership(survey_id, owner_id)
        except Exception as exc:
            return Response(error_response(str(exc), "SURVEY_ACCESS_ERROR"), status=404)

        cached = get_sentiment_cache(survey_id)
        if cached is not None:
            return Response(success_response(cached))

        try:
            sentiment_obj = get_or_analyse_sentiment(survey_id, owner_id)
        except Exception as exc:
            logger.exception("AISentimentView error survey=%s: %s", survey_id, exc)
            return Response(
                success_response({
                    "available": False,
                    "dominant_sentiment": None,
                    "sentiment_distribution": {},
                    "overall_confidence": 0.0,
                    "response_count": 0,
                }),
            )

        payload = _serialise_sentiment(sentiment_obj)
        set_sentiment_cache(survey_id, payload)
        return Response(success_response(payload))


class AIQualityView(APIView):
    """
    GET /api/v1/ai-analytics/quality/<survey_id>/

    Returns AI quality scoring results for a survey's responses.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, survey_id: int) -> Response:
        owner_id = request.user.id

        try:
            validate_survey_ownership(survey_id, owner_id)
        except Exception as exc:
            return Response(error_response(str(exc), "SURVEY_ACCESS_ERROR"), status=404)

        cached = get_quality_cache(survey_id)
        if cached is not None:
            return Response(success_response(cached))

        try:
            quality_obj = get_or_score_quality(survey_id, owner_id)
        except Exception as exc:
            logger.exception("AIQualityView error survey=%s: %s", survey_id, exc)
            return Response(
                success_response({
                    "available": False,
                    "average_score": 0.0,
                    "high_quality_count": 0,
                    "medium_quality_count": 0,
                    "low_quality_count": 0,
                    "suspicious_count": 0,
                    "response_count": 0,
                }),
            )

        payload = _serialise_quality(quality_obj)
        set_quality_cache(survey_id, payload)
        return Response(success_response(payload))


class AIQuestionsView(APIView):
    """
    GET /api/v1/ai-analytics/questions/<survey_id>/

    Returns per-question AI insights for a survey.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, survey_id: int) -> Response:
        owner_id = request.user.id

        try:
            validate_survey_ownership(survey_id, owner_id)
        except Exception as exc:
            return Response(error_response(str(exc), "SURVEY_ACCESS_ERROR"), status=404)

        cached = get_question_insights_cache(survey_id)
        if cached is not None:
            return Response(success_response(cached))

        try:
            question_insights = get_or_analyse_questions(survey_id, owner_id)
        except Exception as exc:
            logger.exception("AIQuestionsView error survey=%s: %s", survey_id, exc)
            return Response(success_response([]))

        payload = [_serialise_question_insight(q) for q in question_insights]
        set_question_insights_cache(survey_id, payload)
        return Response(success_response(payload))
