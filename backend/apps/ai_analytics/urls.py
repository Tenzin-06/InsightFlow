"""
AI Analytics URL configuration.

Endpoints:
    GET /api/v1/ai-analytics/summary/<survey_id>/
    GET /api/v1/ai-analytics/sentiment/<survey_id>/
    GET /api/v1/ai-analytics/quality/<survey_id>/
    GET /api/v1/ai-analytics/questions/<survey_id>/
"""

from django.urls import path
from apps.ai_analytics.views import (
    AISummaryView,
    AISentimentView,
    AIQualityView,
    AIQuestionsView,
)

urlpatterns = [
    path(
        "ai-analytics/summary/<int:survey_id>/",
        AISummaryView.as_view(),
        name="ai-analytics-summary",
    ),
    path(
        "ai-analytics/sentiment/<int:survey_id>/",
        AISentimentView.as_view(),
        name="ai-analytics-sentiment",
    ),
    path(
        "ai-analytics/quality/<int:survey_id>/",
        AIQualityView.as_view(),
        name="ai-analytics-quality",
    ),
    path(
        "ai-analytics/questions/<int:survey_id>/",
        AIQuestionsView.as_view(),
        name="ai-analytics-questions",
    ),
]
