"""
Public optimization API views.

Endpoints:
  GET  /api/v1/optimization/rules/
  POST /api/v1/optimization/rules/
  GET  /api/v1/optimization/events/
  POST /api/v1/optimization/run/
"""

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.permissions import IsAuthenticated
from apps.engagement_optimization.models import (
    OptimizationEvent,
    OptimizationRule,
)
from apps.engagement_optimization.serializers.optimization_serializer import (
    OptimizationEventSerializer,
    OptimizationRuleSerializer,
    OptimizationRunSerializer,
)
from apps.engagement_optimization.services.optimization_engine import (
    run_optimization_for_campaign,
)
from apps.engagement_optimization.utils import error_response, success_response


class OptimizationRuleListCreateView(APIView):
    """
    GET  — list all active optimization rules owned by the authenticated user.
    POST — create a new optimization rule.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        rules = OptimizationRule.objects.filter(owner=request.user)
        serializer = OptimizationRuleSerializer(
            rules, many=True, context={"request": request}
        )
        return Response(success_response(data=serializer.data), status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        serializer = OptimizationRuleSerializer(
            data=request.data, context={"request": request}
        )
        if not serializer.is_valid():
            return Response(
                error_response(
                    str(serializer.errors), code="VALIDATION_ERROR"
                ),
                status=status.HTTP_400_BAD_REQUEST,
            )
        rule = serializer.save()
        return Response(
            success_response(data=OptimizationRuleSerializer(rule).data),
            status=status.HTTP_201_CREATED,
        )


class OptimizationEventListView(APIView):
    """
    GET — list optimization events for campaigns owned by the authenticated user.
    Supports optional query params: ?campaign_id=<id>
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        queryset = OptimizationEvent.objects.filter(
            campaign__owner=request.user
        ).select_related("campaign", "optimization_rule")

        campaign_id = request.query_params.get("campaign_id")
        if campaign_id:
            queryset = queryset.filter(campaign_id=campaign_id)

        limit = int(request.query_params.get("limit", 50))
        offset = int(request.query_params.get("offset", 0))
        page = queryset[offset : offset + limit]

        serializer = OptimizationEventSerializer(page, many=True)
        return Response(
            success_response(
                data={
                    "count": queryset.count(),
                    "limit": limit,
                    "offset": offset,
                    "results": serializer.data,
                }
            ),
            status=status.HTTP_200_OK,
        )


class OptimizationRunView(APIView):
    """
    POST — trigger engagement optimization for a campaign.

    Body: { "campaign_id": <int> }
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = OptimizationRunSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                error_response(str(serializer.errors), code="VALIDATION_ERROR"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        campaign_id = serializer.validated_data["campaign_id"]

        # Ownership guard — verify campaign belongs to user
        from apps.campaigns.models.campaign import Campaign

        try:
            campaign = Campaign.objects.get(pk=campaign_id, owner=request.user)
        except Campaign.DoesNotExist:
            return Response(
                error_response("Campaign not found.", code="NOT_FOUND"),
                status=status.HTTP_404_NOT_FOUND,
            )

        result = run_optimization_for_campaign(campaign_id=campaign.pk)
        return Response(success_response(data=result), status=status.HTTP_200_OK)
