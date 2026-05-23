import logging
from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from apps.reports.constants import (
    REPORT_STATUS_COMPLETED,
    REPORT_STATUS_FAILED,
    REPORT_STATUS_FINALIZING,
    REPORT_STATUS_PREPARING,
    REPORT_STATUS_PROCESSING_ASSETS,
    REPORT_STATUS_QUEUED,
    REPORT_STATUS_RENDERING,
)
from apps.reports.models import ReportExport
from apps.reports.services.asset_manager import get_export_dir, relative_media_path
from apps.reports.services.pdf_renderer import render_pdf_from_html
from apps.reports.services.report_builder import build_report_payload

logger = logging.getLogger(__name__)


def create_report_export(owner, survey, template: str, sections: list[str]) -> ReportExport:
    report = ReportExport.objects.create(
        owner=owner,
        survey=survey,
        template=template,
        sections=sections,
        status=REPORT_STATUS_QUEUED,
        progress=0,
    )
    transaction.on_commit(lambda: process_report_export(report.id))
    return report


def process_report_export(report_id: int) -> ReportExport:
    report = ReportExport.objects.select_related("survey", "owner").get(id=report_id)
    try:
        _set_status(report, REPORT_STATUS_PREPARING, 18)
        payload = build_report_payload(report)

        _set_status(report, REPORT_STATUS_PROCESSING_ASSETS, 48)
        report.analytics_snapshot = payload["analytics"]
        report.ai_snapshot = payload["ai"]
        report.asset_manifest = payload["assets"]
        report.save(update_fields=["analytics_snapshot", "ai_snapshot", "asset_manifest", "updated_at"])

        _set_status(report, REPORT_STATUS_RENDERING, 72)
        output_path = get_export_dir(report.id) / f"insightflow-report-{report.id}.pdf"
        render_pdf_from_html(payload["html"], output_path)

        _set_status(report, REPORT_STATUS_FINALIZING, 92)
        report.file_path = relative_media_path(output_path)
        report.download_expires_at = timezone.now() + timedelta(hours=24)
        report.status = REPORT_STATUS_COMPLETED
        report.progress = 100
        report.completed_at = timezone.now()
        report.error_message = ""
        report.save(
            update_fields=[
                "file_path",
                "download_expires_at",
                "status",
                "progress",
                "completed_at",
                "error_message",
                "updated_at",
            ]
        )
    except Exception as exc:
        logger.exception("Report export failed report=%s", report_id)
        report.status = REPORT_STATUS_FAILED
        report.progress = 100
        report.error_message = str(exc)
        report.save(update_fields=["status", "progress", "error_message", "updated_at"])
    return report


def _set_status(report: ReportExport, status: str, progress: int) -> None:
    report.status = status
    report.progress = progress
    report.save(update_fields=["status", "progress", "updated_at"])

