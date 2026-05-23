from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.permissions import IsAuthenticated
from apps.automation.models import AutomationSchedule
from apps.automation.permissions import IsAutomationOwner
from apps.automation.serializers import AutomationScheduleSerializer, CampaignScheduleSerializer
from apps.automation.services.scheduler_service import (
    AutomationValidationError,
    cancel_schedule,
    schedule_campaign,
)
from apps.automation.utils import error_response, success_response
from apps.campaigns.models.campaign import Campaign
from apps.campaigns.permissions import IsCampaignOwner


class CampaignScheduleView(APIView):
    permission_classes = [IsAuthenticated, IsCampaignOwner]

    def post(self, request, pk: int):
        campaign = get_object_or_404(Campaign, pk=pk, owner=request.user)
        self.check_object_permissions(request, campaign)

        serializer = CampaignScheduleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            schedule = schedule_campaign(
                campaign=campaign,
                scheduled_for=serializer.validated_data["scheduled_for"],
                reminder_delays=serializer.validated_data["reminder_delays"],
                max_reminders=serializer.validated_data["max_reminders"],
            )
        except AutomationValidationError as exc:
            return Response(
                error_response(str(exc), code="INVALID_SCHEDULE"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = AutomationScheduleSerializer(schedule).data
        return Response(success_response(data=data), status=status.HTTP_201_CREATED)


class CampaignCancelAutomationView(APIView):
    permission_classes = [IsAuthenticated, IsCampaignOwner]

    def post(self, request, pk: int):
        campaign = get_object_or_404(Campaign, pk=pk, owner=request.user)
        self.check_object_permissions(request, campaign)

        schedule = (
            AutomationSchedule.objects.filter(campaign=campaign)
            .exclude(status__in=["completed", "failed", "cancelled"])
            .order_by("-created_at")
            .first()
        )
        if schedule is None:
            return Response(
                error_response("No active automation schedule found.", code="NO_ACTIVE_AUTOMATION"),
                status=status.HTTP_404_NOT_FOUND,
            )

        schedule = cancel_schedule(schedule)
        return Response(success_response(data=AutomationScheduleSerializer(schedule).data))


class AutomationScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AutomationScheduleSerializer
    permission_classes = [IsAuthenticated, IsAutomationOwner]
    pagination_class = None

    def get_queryset(self):
        return (
            AutomationSchedule.objects.filter(owner=self.request.user)
            .select_related("campaign", "owner")
            .prefetch_related("events", "campaign__reminder_rules")
        )

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(success_response(data=serializer.data))

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response(success_response(data=serializer.data))

