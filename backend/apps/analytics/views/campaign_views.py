"""
Campaign-level analytics views.

GET /api/v1/analytics/campaigns/:id/  — delivery metrics, trend, funnel
"""

import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.exceptions import NotFound

from apps.analytics.permissions import IsAnalyticsOwner
from apps.analytics.validators import validate_days_param
from apps.analytics.services.campaign_analytics import get_campaign_analytics
from apps.analytics.services import (
    get_campaign_cache,
    set_campaign_cache,
)
from apps.analytics.utils import success_response, error_response

logger = logging.getLogger(__name__)


class CampaignAnalyticsView(APIView):
    """
    Return analytics for a specific campaign owned by the authenticated user.

    URL param:
        pk (int): campaign primary key.

    Query params:
        days (int, 1–365): time window for trend charts. Default: 30.

    Response:
        {
            "success": true,
            "data": {
                "metrics": {
                    "emails_sent": ...,
                    "emails_failed": ...,
                    "delivery_rate": ...,
                    "response_rate": ...,
                    "total_responses": ...,
                },
                "charts": {"delivery_trend": [...]},
                "trends": {"delivery_trend": [...]},
                "funnel": [...],
            }
        }
    """

    permission_classes = [IsAnalyticsOwner]

    def get(self, request: Request, pk: int) -> Response:
        campaign = self._get_campaign_or_404(pk)
        self.check_object_permissions(request, campaign)

        days = validate_days_param(request.query_params.get("days"))

        cached = get_campaign_cache(campaign.id)
        if cached is not None:
            logger.debug("Campaign analytics cache hit campaign=%s", campaign.id)
            return Response(success_response(cached))

        try:
            payload = get_campaign_analytics(campaign_id=campaign.id, days=days)
        except Exception as exc:
            logger.exception(
                "Campaign analytics computation failed campaign=%s", campaign.id
            )
            return Response(
                error_response("Failed to compute campaign analytics."),
                status=500,
            )

        set_campaign_cache(campaign.id, payload)
        return Response(success_response(payload))

    @staticmethod
    def _get_campaign_or_404(pk: int):
        from apps.campaigns.models import Campaign

        try:
            return Campaign.objects.get(pk=pk)
        except Campaign.DoesNotExist:
            raise NotFound(f"Campaign {pk} not found.")
