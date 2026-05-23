"""
Campaign delivery log views.

GET /api/v1/campaigns/:pk/delivery-logs/

Returns delivery log records for a campaign, restricted to the owner.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.authentication.permissions import IsAuthenticated
from apps.campaigns.models.campaign import Campaign
from apps.email_campaigns.models.delivery_log import DeliveryLog
from apps.email_campaigns.serializers.delivery_serializer import DeliveryLogSerializer
from apps.email_campaigns.utils import success_response

logger = logging.getLogger(__name__)


class CampaignDeliveryLogView(APIView):
    """
    GET /api/v1/campaigns/:pk/delivery-logs/

    Returns all delivery log records for a campaign.
    Restricted to the campaign owner.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        campaign = get_object_or_404(Campaign, pk=pk, owner=request.user)
        logs = DeliveryLog.objects.filter(campaign=campaign).order_by("-created_at")
        serializer = DeliveryLogSerializer(logs, many=True)
        return Response(success_response(data=serializer.data))
