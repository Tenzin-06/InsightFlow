"""
Send views.

POST /api/v1/campaigns/:id/send/   — trigger campaign email delivery (async)
POST /api/v1/campaigns/:id/test/   — send a single test email for QA (async)

Access is restricted to the campaign owner.
Views are intentionally thin — business logic lives in queue_service and campaign_processor.

Async response pattern:
    Request received
    → validate ownership + campaign state
    → enqueue background job via Trigger.dev
    → return { success: true, data: { job_id: "..." } } immediately (HTTP 202)
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.authentication.permissions import IsAuthenticated
from apps.campaigns.models.campaign import Campaign
from apps.campaigns.constants import (
    CAMPAIGN_STATUS_SENT,
    CAMPAIGN_STATUS_SENDING,
)
from apps.email_campaigns.serializers.send_serializer import (
    TestEmailSerializer,
)
from apps.email_campaigns.validators import (
    validate_campaign_ready_to_send,
    validate_test_email_address,
)
from apps.email_campaigns.services.queue_service import (
    enqueue_campaign_send,
    enqueue_test_email,
)
from apps.email_campaigns.utils import success_response, error_response
from rest_framework.exceptions import ValidationError

logger = logging.getLogger(__name__)


def _get_owned_campaign(pk: int, user):
    """Return a Campaign owned by the requesting user or raise 404/403."""
    campaign = get_object_or_404(Campaign, pk=pk)
    if campaign.owner != user:
        from rest_framework.exceptions import PermissionDenied
        raise PermissionDenied("You do not have permission to send this campaign.")
    return campaign


class CampaignSendView(APIView):
    """
    POST /api/v1/campaigns/:pk/send/

    Initiates asynchronous email delivery for the specified campaign.
    Only the campaign owner may trigger a send.

    Validates:
    - campaign ownership
    - subject line present
    - audience + recipients exist
    - campaign not already sent or sending

    Returns immediately with a job_id (HTTP 202).
    The actual delivery runs in the Trigger.dev background worker.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk: int) -> Response:
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

        # Validate campaign is ready to send
        try:
            validate_campaign_ready_to_send(campaign)
        except ValidationError as exc:
            return Response(
                error_response(str(exc.detail[0]), code="VALIDATION_ERROR"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Enqueue the async job — returns a job_id immediately
        job_id = enqueue_campaign_send(campaign.pk)

        logger.info(
            "Campaign send enqueued — campaign_id=%s, job_id=%s, user=%s",
            pk,
            job_id,
            request.user.pk,
        )

        return Response(
            success_response(data={"job_id": job_id}),
            status=status.HTTP_202_ACCEPTED,
        )


class CampaignTestSendView(APIView):
    """
    POST /api/v1/campaigns/:pk/test/

    Sends a single test email for template validation.
    Request body: { "email": "user@example.com" }

    Does not alter campaign state or log to DeliveryLog.
    Returns immediately with a job_id (HTTP 202).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk: int) -> Response:
        campaign = _get_owned_campaign(pk, request.user)

        serializer = TestEmailSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                error_response(str(serializer.errors), code="VALIDATION_ERROR"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        test_address: str = serializer.validated_data["email"]

        try:
            validate_test_email_address(test_address)
        except ValidationError as exc:
            return Response(
                error_response(str(exc.detail[0]), code="INVALID_EMAIL"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Enqueue the async test send — returns a job_id immediately
        job_id = enqueue_test_email(campaign.pk, test_address)

        logger.info(
            "Test email enqueued — campaign_id=%s, email=%s, job_id=%s",
            pk,
            test_address,
            job_id,
        )

        return Response(
            success_response(data={"job_id": job_id, "email": test_address}),
            status=status.HTTP_202_ACCEPTED,
        )
