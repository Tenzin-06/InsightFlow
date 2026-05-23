"""
Survey-level analytics views.

GET /api/v1/analytics/surveys/:id/  — metrics, trend, funnel, question engagement
"""

import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.exceptions import NotFound

from apps.analytics.permissions import IsAnalyticsOwner
from apps.analytics.validators import validate_days_param
from apps.analytics.services.survey_analytics import get_survey_analytics
from apps.analytics.services import (
    get_survey_cache,
    set_survey_cache,
)
from apps.analytics.utils import success_response, error_response

logger = logging.getLogger(__name__)


class SurveyAnalyticsView(APIView):
    """
    Return analytics for a specific survey owned by the authenticated user.

    URL param:
        pk (int): survey primary key.

    Query params:
        days (int, 1–365): time window for trend charts. Default: 30.

    Response:
        {
            "success": true,
            "data": {
                "metrics": {
                    "total_responses": ...,
                    "completion_rate": ...,
                    "drop_off_rate": ...,
                    "question_count": ...,
                },
                "charts": {
                    "response_trend": [...],
                    "question_engagement": [...],
                },
                "trends": {"response_trend": [...]},
                "funnel": [...],
            }
        }
    """

    permission_classes = [IsAnalyticsOwner]

    def get(self, request: Request, pk: int) -> Response:
        survey = self._get_survey_or_404(pk)
        self.check_object_permissions(request, survey)

        days = validate_days_param(request.query_params.get("days"))

        cached = get_survey_cache(survey.id)
        if cached is not None:
            logger.debug("Survey analytics cache hit survey=%s", survey.id)
            return Response(success_response(cached))

        try:
            payload = get_survey_analytics(survey_id=survey.id, days=days)
        except Exception as exc:
            logger.exception("Survey analytics computation failed survey=%s", survey.id)
            return Response(
                error_response("Failed to compute survey analytics."),
                status=500,
            )

        set_survey_cache(survey.id, payload)
        return Response(success_response(payload))

    @staticmethod
    def _get_survey_or_404(pk: int):
        from apps.surveys.models.survey import Survey

        try:
            return Survey.objects.get(pk=pk)
        except Survey.DoesNotExist:
            raise NotFound(f"Survey {pk} not found.")
