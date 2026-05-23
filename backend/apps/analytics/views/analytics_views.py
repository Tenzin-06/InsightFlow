"""
Dashboard-level analytics views.

GET /api/v1/analytics/dashboard/   — overview metrics for the authenticated user
GET /api/v1/analytics/engagement/  — engagement funnel + interaction analytics
"""

import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request

from apps.analytics.permissions import IsAnalyticsOwner
from apps.analytics.validators import validate_days_param
from apps.analytics.services.dashboard_service import get_dashboard_overview
from apps.analytics.services.engagement_analytics import get_engagement_analytics
from apps.analytics.services import (
    get_dashboard_cache,
    set_dashboard_cache,
    get_engagement_cache,
    set_engagement_cache,
)
from apps.analytics.constants import DASHBOARD_CACHE_TTL
from apps.analytics.utils import success_response, error_response

logger = logging.getLogger(__name__)


class DashboardAnalyticsView(APIView):
    """
    Return dashboard-level analytics for the authenticated user.

    Query params:
        days (int, 1–365): time window for trend charts. Default: 30.

    Response:
        {
            "success": true,
            "data": {
                "metrics": {...},
                "charts": {"response_trend": [...], "top_surveys": [...]},
                "trends": {"response_trend": [...]},
                "segments": {"top_surveys": [...]},
            }
        }
    """

    permission_classes = [IsAnalyticsOwner]

    def get(self, request: Request) -> Response:
        user = request.user
        days = validate_days_param(request.query_params.get("days"))

        # Cache check
        cached = get_dashboard_cache(user.id)
        if cached is not None:
            logger.debug("Dashboard analytics cache hit for user=%s", user.id)
            return Response(success_response(cached))

        try:
            payload = get_dashboard_overview(user_id=user.id, days=days)
        except Exception as exc:
            logger.exception("Dashboard analytics computation failed for user=%s", user.id)
            return Response(
                error_response("Failed to compute dashboard analytics."),
                status=500,
            )

        set_dashboard_cache(user.id, payload, ttl=DASHBOARD_CACHE_TTL)
        return Response(success_response(payload))


class EngagementAnalyticsView(APIView):
    """
    Return engagement analytics for all of the authenticated user's campaigns.

    Query params:
        days (int, 1–365): time window for timeline chart. Default: 30.

    Response:
        {
            "success": true,
            "data": {
                "metrics": {...},
                "charts": {"funnel": [...], "drop_off": [...], "timeline": [...], "segments": [...]},
                "trends": {"timeline": [...]},
                "funnel": [...],
            }
        }
    """

    permission_classes = [IsAnalyticsOwner]

    def get(self, request: Request) -> Response:
        user = request.user
        days = validate_days_param(request.query_params.get("days"))

        cached = get_engagement_cache(user.id)
        if cached is not None:
            logger.debug("Engagement analytics cache hit for user=%s", user.id)
            return Response(success_response(cached))

        try:
            payload = get_engagement_analytics(user_id=user.id, days=days)
        except Exception as exc:
            logger.exception("Engagement analytics failed for user=%s", user.id)
            return Response(
                error_response("Failed to compute engagement analytics."),
                status=500,
            )

        set_engagement_cache(user.id, payload)
        return Response(success_response(payload))
