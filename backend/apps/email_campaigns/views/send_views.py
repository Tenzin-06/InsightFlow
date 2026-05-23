"""
Send views.

POST /api/v1/campaigns/:id/send/   — trigger campaign email delivery
POST /api/v1/campaigns/:id/test/   — send a single test email for QA

Access is restricted to the campaign owner.
Views are intentionally thin — all business logic lives in campaign_processor.py.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.authentication.permissions import IsAuthenticated
from apps.email_campaigns.permissions import IsCampaignOwner
from apps.campaigns.models.campaign import Campaign
from apps.campaigns.constants import (
    CAMPAIGN_STATUS_SENT,
    CAMPAIGN_STATUS_SENDING,
)
from apps.email_campaigns.serializers.send_serializer import (
    SendCampaignSerializer,
    TestEmailSerializer,
)
from apps.email_campaigns.validators import (
    validate_campaign_ready_to_send,
    validate_test_email_address,
)
from apps.email_campaigns.services.campaign_processor import (
    process_campaign,
    process_test_send,
)
from apps.email_campaigns.utils import success_response, error_response
from rest_framework.exceptions import ValidationError

logger = logging.getLogger(__name__)


def _get_owned_campaign(pk, user):
    """Return a Campaign owned by the requesting user or raise 404."""
    campaign = get_object_or_404(Campaign, pk=pk)
    if campaign.owner != user:
        from rest_framework.exceptions import PermissionDenied
        raise PermissionDenied("You do not have permission to send this campaign.")
    return campaign


class CampaignSendView(APIView):
    """
    POST /api/v1/campaigns/:pk/send/

    Initiates email delivery for the specified campaign.
    Only the campaign owner may trigger a send.

    Validates:
    - campaign ownership
    - subject line present
    - audience + recipients exist

    Returns summary: { success, sent, failed }
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        campaign = _get_owned_campaign(pk, request.user)

        # Guard: already sent or currently sending
        if campaign.status in (CAMPAIGN_STATUS_SENT, CAMPAIGN_STATUS_SENDING):
            return Response(
                error_response(
                    f"Campaign is already in '{campaign.status}' state.",
                    code="CAMPAIGN_ALREADY_SENT",
                ),
                status=status.HTTP_409_CONFLICT,
            )

        # Validate campaign is ready
        try:
            validate_campaign_ready_to_send(campaign)
        except ValidationError as exc:
            return Response(
                error_response(str(exc.detail[0]), code="VALIDATION_ERROR"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Execute delivery (synchronous for now)
        result = process_campaign(campaign.pk)

        if result.get("success"):
            return Response(
                success_response(
                    data={
                        "sent": result["sent"],
                        "failed": result["failed"],
                        "total": result["total"],
                    }
                ),
                status=status.HTTP_200_OK,
            )

        return Response(
            error_response(result.get("message", "Campaign send failed."), code="SEND_ERROR"),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class CampaignTestSendView(APIView):
    """
    POST /api/v1/campaigns/:pk/test/

    Sends a single test email for template validation.
    Request body: { "email": "user@example.com" }

    Does not alter campaign state or log to DeliveryLog.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        campaign = _get_owned_campaign(pk, request.user)

        serializer = TestEmailSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                error_response(str(serializer.errors), code="VALIDATION_ERROR"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        test_address = serializer.validated_data["email"]

        try:
            validate_test_email_address(test_address)
        except ValidationError as exc:
            return Response(
                error_response(str(exc.detail[0]), code="INVALID_EMAIL"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = process_test_send(campaign.pk, test_address)

        if result.get("success"):
            return Response(success_response(data={"email": test_address}), status=status.HTTP_200_OK)

        return Response(
            error_response(result.get("message", "Test send failed."), code="SEND_ERROR"),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
