from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

from apps.authentication.permissions import IsAuthenticated
from apps.campaigns.models.campaign import Campaign
from apps.engagement.services.analytics_service import get_campaign_engagement_summary
from apps.engagement.utils import success_response


class CampaignEngagementAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        campaign = get_object_or_404(Campaign, pk=pk, owner=request.user)
        return success_response(get_campaign_engagement_summary(campaign))

