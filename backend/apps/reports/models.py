import uuid

from django.db import models
from django.utils import timezone

from apps.core.models import TimeStampedModel
from apps.reports.constants import (
    REPORT_STATUS_CHOICES,
    REPORT_STATUS_QUEUED,
    REPORT_TEMPLATE_CHOICES,
)


class ReportExport(TimeStampedModel):
    owner = models.ForeignKey(
        "authentication.AppUser",
        on_delete=models.CASCADE,
        related_name="report_exports",
    )
    survey = models.ForeignKey(
        "surveys.Survey",
        on_delete=models.CASCADE,
        related_name="report_exports",
    )
    template = models.CharField(max_length=64, choices=REPORT_TEMPLATE_CHOICES)
    sections = models.JSONField(default=list)
    status = models.CharField(
        max_length=32,
        choices=REPORT_STATUS_CHOICES,
        default=REPORT_STATUS_QUEUED,
    )
    progress = models.PositiveSmallIntegerField(default=0)
    file_path = models.CharField(max_length=512, blank=True)
    download_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    download_expires_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    analytics_snapshot = models.JSONField(default=dict, blank=True)
    ai_snapshot = models.JSONField(default=dict, blank=True)
    asset_manifest = models.JSONField(default=dict, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "report_exports"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["owner"], name="report_export_owner_idx"),
            models.Index(fields=["survey"], name="report_export_survey_idx"),
            models.Index(fields=["status"], name="report_export_status_idx"),
            models.Index(fields=["download_token"], name="report_export_token_idx"),
            models.Index(fields=["created_at"], name="report_export_created_idx"),
        ]

    def mark_status(self, status: str, progress: int) -> None:
        self.status = status
        self.progress = progress
        update_fields = ["status", "progress", "updated_at"]
        if status == "completed":
            self.completed_at = timezone.now()
            update_fields.append("completed_at")
        self.save(update_fields=update_fields)

    def __str__(self) -> str:
        return f"ReportExport id={self.id} survey={self.survey_id} status={self.status}"

