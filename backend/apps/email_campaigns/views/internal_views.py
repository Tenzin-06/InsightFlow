"""
Internal processing views — called by Trigger.dev workers, NOT by end users.

These endpoints are protected by the shared TRIGGER_INTERNAL_SECRET header.
They are not included in the public API surface and should not appear in the
API documentation.

Worker → Django flow:
    Trigger.dev Node.js task receives payload
    → calls POST /api/v1/internal/campaigns/:pk/process/
    → Django processes the campaign synchronously
    → returns result JSON
"""

import logging
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import BasePermission
from rest_framework.request import Request

from apps.campaigns.models.campaign import Campaign
from apps.email_campaigns.services.campaign_processor import (
    process_campaign,
    process_test_send,
)
from apps.email_campaigns.services.queue_service import get_job_status
from apps.email_campaigns.models.background_job import BackgroundJob
from apps.email_campaigns.utils import success_response, error_response

logger = logging.getLogger(__name__)


class NoAuthentication(BaseAuthentication):
    """Bypass DRF's default JWT auth for internal endpoints."""

    def authenticate(self, request: Request):  # type: ignore[override]
        return None


class InternalSecretPermission(BasePermission):
    """
    Allow only requests carrying the correct X-Trigger-Internal-Secret header.
    Rejects all others with 403 — even if the header is absent.
    """

    def has_permission(self, request: Request, view) -> bool:  # type: ignore[override]
        expected = getattr(settings, "TRIGGER_INTERNAL_SECRET", "")
        provided = request.META.get("HTTP_X_TRIGGER_INTERNAL_SECRET", "")

        if not expected:
            logger.warning(
                "TRIGGER_INTERNAL_SECRET is not configured — blocking internal request"
            )
            return False

        return bool(provided and provided == expected)


class InternalCampaignProcessView(APIView):
    """
    POST /api/v1/internal/campaigns/:pk/process/

    Called by the send-campaign Trigger.dev worker.
    Processes full email delivery for the specified campaign.

    Access: internal only (X-Trigger-Internal-Secret required)
    Authentication: none (bypasses user JWT)
    """

    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request, pk: int) -> Response:
        campaign = get_object_or_404(Campaign, pk=pk)

        logger.info("Internal campaign process requested — campaign_id=%s", pk)

        # Update any associated BackgroundJob to running
        try:
            BackgroundJob.objects.filter(
                task_id="send-campaign",
                payload__campaignId=pk,
                status__in=[BackgroundJob.STATUS_QUEUED, BackgroundJob.STATUS_RUNNING],
            ).update(status=BackgroundJob.STATUS_RUNNING)
        except Exception as exc:
            logger.warning("Could not update BackgroundJob status: %s", exc)

        result = process_campaign(campaign.pk)

        # Update BackgroundJob with the result
        try:
            BackgroundJob.objects.filter(
                task_id="send-campaign",
                payload__campaignId=pk,
                status=BackgroundJob.STATUS_RUNNING,
            ).update(
                status=BackgroundJob.STATUS_COMPLETED if result.get("success") else BackgroundJob.STATUS_FAILED,
                result=result,
            )
        except Exception as exc:
            logger.warning("Could not update BackgroundJob result: %s", exc)

        if result.get("success"):
            return Response(success_response(data=result), status=status.HTTP_200_OK)

        return Response(
            error_response(
                result.get("message", "Campaign processing failed."),
                code="PROCESS_ERROR",
            ),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class InternalCampaignTestProcessView(APIView):
    """
    POST /api/v1/internal/campaigns/:pk/test-process/

    Called by the send-test-email Trigger.dev worker.
    Sends a single test email without altering campaign state.

    Request body: { "email": "user@example.com" }
    Access: internal only (X-Trigger-Internal-Secret required)
    """

    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request, pk: int) -> Response:
        campaign = get_object_or_404(Campaign, pk=pk)
        email = request.data.get("email", "")

        if not email:
            return Response(
                error_response("email is required", code="MISSING_EMAIL"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info("Internal test send requested — campaign_id=%s, email=%s", pk, email)

        result = process_test_send(campaign.pk, email)

        if result.get("success"):
            return Response(success_response(data=result), status=status.HTTP_200_OK)

        return Response(
            error_response(
                result.get("message", "Test send failed."),
                code="TEST_SEND_ERROR",
            ),
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class InternalJobCleanupView(APIView):
    """
    POST /api/v1/internal/jobs/cleanup/

    Called by the cleanup-jobs Trigger.dev worker.
    Deletes BackgroundJob records older than olderThanDays.

    Request body: { "olderThanDays": 30 }
    Access: internal only (X-Trigger-Internal-Secret required)
    """

    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request) -> Response:
        from datetime import timedelta
        from django.utils import timezone

        older_than_days = int(request.data.get("olderThanDays", 30))
        cutoff = timezone.now() - timedelta(days=older_than_days)

        deleted_count, _ = BackgroundJob.objects.filter(
            created_at__lt=cutoff,
            status__in=[BackgroundJob.STATUS_COMPLETED, BackgroundJob.STATUS_FAILED],
        ).delete()

        logger.info("BackgroundJob cleanup — deleted=%s, cutoff=%s", deleted_count, cutoff)

        return Response(
            success_response(data={"deleted": deleted_count}),
            status=status.HTTP_200_OK,
        )
