from pathlib import Path

from django.conf import settings
from django.http import FileResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.reports.constants import REPORT_STATUS_COMPLETED, REPORT_TEMPLATES
from apps.reports.models import ReportExport
from apps.reports.serializers import (
    ReportExportSerializer,
    ReportGenerateSerializer,
    ReportStatusSerializer,
)
from apps.reports.services import create_report_export
from apps.reports.api_response import success_response
from apps.surveys.models.survey import Survey


class ReportGenerateView(APIView):
    def post(self, request):
        serializer = ReportGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        survey = _get_owned_survey(serializer.validated_data["survey_id"], request.user)

        report = create_report_export(
            owner=request.user,
            survey=survey,
            template=serializer.validated_data["template"],
            sections=serializer.validated_data["sections"],
        )
        report.refresh_from_db()

        data = ReportExportSerializer(report, context={"request": request}).data
        return Response(success_response(data), status=status.HTTP_201_CREATED)


class ReportStatusView(APIView):
    def get(self, request, pk: int):
        report = _get_owned_report(pk, request.user)
        data = ReportStatusSerializer(report, context={"request": request}).data
        return Response(success_response(data))


class ReportDownloadView(APIView):
    def get(self, request, pk: int):
        report = _get_owned_report(pk, request.user)
        if report.status != REPORT_STATUS_COMPLETED:
            raise ValidationError("Report is not ready for download.")
        if report.download_expires_at and report.download_expires_at < timezone.now():
            raise ValidationError("Report download link has expired.")
        if not report.file_path:
            raise NotFound("Report file is missing.")

        file_path = Path(settings.MEDIA_ROOT) / report.file_path
        if not file_path.exists():
            raise NotFound("Report file is missing.")

        return FileResponse(
            file_path.open("rb"),
            as_attachment=True,
            filename=f"insightflow-report-{report.id}.pdf",
            content_type="application/pdf",
        )


class ReportTemplatesView(APIView):
    def get(self, request):
        return Response(success_response(list(REPORT_TEMPLATES.values())))


def _get_owned_survey(survey_id: int, user):
    try:
        return Survey.objects.get(id=survey_id, owner=user)
    except Survey.DoesNotExist:
        raise NotFound("Survey not found.")


def _get_owned_report(report_id: int, user):
    try:
        return ReportExport.objects.select_related("survey", "owner").get(id=report_id)
    except ReportExport.DoesNotExist:
        raise NotFound("Report not found.")
    if report.owner_id != user.id:
        raise PermissionDenied("You do not have access to this report.")
    return report
