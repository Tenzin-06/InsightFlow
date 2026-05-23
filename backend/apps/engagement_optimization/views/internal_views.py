"""
Internal views called exclusively by Trigger.dev workers.

All views require the X-Trigger-Internal-Secret header.
"""

import logging

from django.conf import settings
from rest_framework import status
from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.campaigns.models.campaign import Campaign
from apps.engagement_optimization.services.optimization_engine import (
    run_optimization_for_campaign,
)
from apps.engagement_optimization.services.segmentation_service import (
    generate_segments_for_campaign,
)
from apps.engagement_optimization.services.targeting_service import get_nonrespondents
from apps.engagement_optimization.utils import error_response, success_response

logger = logging.getLogger("engagement_optimization")


# ---------------------------------------------------------------------------
# Auth helpers (mirrors automation app pattern)
# ---------------------------------------------------------------------------

class NoAuthentication(BaseAuthentication):
    def authenticate(self, request: Request):  # type: ignore[override]
        return None


class InternalSecretPermission(BasePermission):
    def has_permission(self, request: Request, view) -> bool:  # type: ignore[override]
        expected = getattr(settings, "TRIGGER_INTERNAL_SECRET", "")
        provided = request.META.get("HTTP_X_TRIGGER_INTERNAL_SECRET", "")
        return bool(expected and provided and provided == expected)


# ---------------------------------------------------------------------------
# Internal views
# ---------------------------------------------------------------------------

class InternalProcessNonrespondentsView(APIView):
    """
    POST /api/v1/internal/optimization/process-nonrespondents/

    Body: { "campaignId": <int> }
    Returns the list of non-respondent emails for a campaign.
    """

    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request) -> Response:
        campaign_id = request.data.get("campaignId")
        if not campaign_id:
            return Response(
                error_response("campaignId is required.", code="INVALID_PAYLOAD"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            campaign = Campaign.objects.select_related("survey", "owner").get(
                pk=int(campaign_id)
            )
        except Campaign.DoesNotExist:
            return Response(
                error_response("Campaign not found.", code="NOT_FOUND"),
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            nonrespondents = get_nonrespondents(campaign=campaign)
        except Exception as exc:
            logger.exception("process-nonrespondents failed")
            return Response(
                error_response(str(exc), code="PROCESSING_ERROR"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            success_response(
                data={
                    "campaign_id": campaign.pk,
                    "count": len(nonrespondents),
                    "emails": [nr.email for nr in nonrespondents],
                }
            ),
            status=status.HTTP_200_OK,
        )


class InternalEvaluateOptRulesView(APIView):
    """
    POST /api/v1/internal/optimization/evaluate-rules/

    Body: { "campaignId": <int> }
    Runs the full optimization engine for a campaign.
    """

    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request) -> Response:
        campaign_id = request.data.get("campaignId")
        if not campaign_id:
            return Response(
                error_response("campaignId is required.", code="INVALID_PAYLOAD"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = run_optimization_for_campaign(campaign_id=int(campaign_id))
        except Exception as exc:
            logger.exception("evaluate-opt-rules failed")
            return Response(
                error_response(str(exc), code="RULE_EVALUATION_ERROR"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(success_response(data=result), status=status.HTTP_200_OK)


class InternalTriggerFollowupsView(APIView):
    """
    POST /api/v1/internal/optimization/trigger-followups/

    Body: { "campaignId": <int>, "emails": ["a@b.com", ...] }
    Runs the optimization engine for the provided recipient subset.
    """

    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request) -> Response:
        campaign_id = request.data.get("campaignId")
        if not campaign_id:
            return Response(
                error_response("campaignId is required.", code="INVALID_PAYLOAD"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = run_optimization_for_campaign(campaign_id=int(campaign_id))
        except Exception as exc:
            logger.exception("trigger-followups failed")
            return Response(
                error_response(str(exc), code="FOLLOWUP_TRIGGER_ERROR"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(success_response(data=result), status=status.HTTP_200_OK)


class InternalGenerateSegmentsView(APIView):
    """
    POST /api/v1/internal/optimization/generate-segments/

    Body: { "campaignId": <int> }
    Generates engagement segments for all delivered recipients.
    """

    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request) -> Response:
        campaign_id = request.data.get("campaignId")
        if not campaign_id:
            return Response(
                error_response("campaignId is required.", code="INVALID_PAYLOAD"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            campaign = Campaign.objects.select_related("survey", "owner").get(
                pk=int(campaign_id)
            )
        except Campaign.DoesNotExist:
            return Response(
                error_response("Campaign not found.", code="NOT_FOUND"),
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            from apps.email_campaigns.constants import DELIVERY_STATUS_SENT
            from apps.email_campaigns.models import DeliveryLog

            emails = list(
                DeliveryLog.objects.filter(
                    campaign=campaign, status=DELIVERY_STATUS_SENT
                )
                .values_list("recipient_email", flat=True)
                .distinct()
            )
            summary = generate_segments_for_campaign(campaign=campaign, emails=emails)
        except Exception as exc:
            logger.exception("generate-segments failed")
            return Response(
                error_response(str(exc), code="SEGMENTATION_ERROR"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            success_response(
                data={
                    "campaign_id": campaign.pk,
                    "segments": summary,
                    "total": sum(summary.values()),
                }
            ),
            status=status.HTTP_200_OK,
        )
