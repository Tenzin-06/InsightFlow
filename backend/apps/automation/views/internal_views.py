import logging

from django.conf import settings
from rest_framework import status
from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.automation.services.followup_service import evaluate_followups
from apps.automation.services.reminder_service import process_reminders
from apps.automation.services.scheduler_service import execute_scheduled_campaign
from apps.automation.utils import error_response, success_response

logger = logging.getLogger(__name__)


class NoAuthentication(BaseAuthentication):
    def authenticate(self, request: Request):  # type: ignore[override]
        return None


class InternalSecretPermission(BasePermission):
    def has_permission(self, request: Request, view) -> bool:  # type: ignore[override]
        expected = getattr(settings, "TRIGGER_INTERNAL_SECRET", "")
        provided = request.META.get("HTTP_X_TRIGGER_INTERNAL_SECRET", "")
        return bool(expected and provided and provided == expected)


class InternalExecuteScheduledCampaignView(APIView):
    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request, schedule_id: int) -> Response:
        try:
            result = execute_scheduled_campaign(schedule_id)
        except Exception as exc:
            logger.exception("Scheduled campaign execution failed")
            return Response(
                error_response(str(exc), code="SCHEDULE_EXECUTION_ERROR"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if result.get("success"):
            return Response(success_response(data=result), status=status.HTTP_200_OK)
        return Response(error_response(result.get("message", "Execution failed.")), status=status.HTTP_400_BAD_REQUEST)


class InternalProcessRemindersView(APIView):
    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request) -> Response:
        campaign_id = request.data.get("campaignId")
        delay_days = request.data.get("delayDays")
        if not campaign_id or not delay_days:
            return Response(
                error_response("campaignId and delayDays are required.", code="INVALID_REMINDER_PAYLOAD"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = process_reminders(campaign_id=int(campaign_id), delay_days=int(delay_days))
        except Exception as exc:
            logger.exception("Reminder processing failed")
            return Response(
                error_response(str(exc), code="REMINDER_PROCESSING_ERROR"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(success_response(data=result), status=status.HTTP_200_OK)


class InternalEvaluateFollowupsView(APIView):
    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request) -> Response:
        campaign_id = request.data.get("campaignId")
        delay_days = request.data.get("delayDays")
        if not campaign_id or not delay_days:
            return Response(
                error_response("campaignId and delayDays are required.", code="INVALID_FOLLOWUP_PAYLOAD"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = evaluate_followups(campaign_id=int(campaign_id), delay_days=int(delay_days))
        return Response(success_response(data=result), status=status.HTTP_200_OK)

