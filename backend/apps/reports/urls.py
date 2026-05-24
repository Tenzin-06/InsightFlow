from django.urls import path

from apps.reports.views import (
    ReportDownloadView,
    ReportGenerateView,
    ReportPreviewDataView,
    ReportStatusView,
    ReportTemplatesView,
)

urlpatterns = [
    # ── AI-powered JSON preview (new) ─────────────────────────────────────────
    path(
        "reports/preview/<int:survey_id>/",
        ReportPreviewDataView.as_view(),
        name="reports-preview-data",
    ),
    # ── PDF export workflow ────────────────────────────────────────────────────
    path("reports/generate/", ReportGenerateView.as_view(), name="reports-generate"),
    path("reports/<int:pk>/status/", ReportStatusView.as_view(), name="reports-status"),
    path("reports/<int:pk>/download/", ReportDownloadView.as_view(), name="reports-download"),
    path("reports/templates/", ReportTemplatesView.as_view(), name="reports-templates"),
]

