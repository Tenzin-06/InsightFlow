"""
AIJob — persists the metadata for every AI processing request.

Lifecycle:
    pending → processing → completed
                         ↘ failed
"""

from django.db import models
from apps.core.models import TimeStampedModel
from apps.ai.constants.ai_constants import AIJobStatus, AIJobType


class AIJob(TimeStampedModel):
    """
    Top-level record for an AI task.

    Fields
    ------
    job_type      : Which kind of AI operation is being performed.
    status        : Current lifecycle state.
    payload       : Raw input data supplied when the job was created.
    result        : Normalised AI output once the job completes.
    error_message : Failure detail when status == failed.
    """

    job_type = models.CharField(
        max_length=50,
        choices=AIJobType.CHOICES,
        db_index=True,
    )
    status = models.CharField(
        max_length=20,
        choices=AIJobStatus.CHOICES,
        default=AIJobStatus.PENDING,
        db_index=True,
    )
    payload = models.JSONField(default=dict, blank=True)
    result = models.JSONField(null=True, blank=True)
    error_message = models.TextField(blank=True, default="")

    class Meta:
        app_label = "ai"
        db_table = "ai_jobs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["job_type", "status"]),
        ]

    def __str__(self) -> str:
        return f"AIJob(id={self.pk}, type={self.job_type}, status={self.status})"

    # ------------------------------------------------------------------
    # Lifecycle helpers
    # ------------------------------------------------------------------

    def mark_processing(self) -> None:
        self.status = AIJobStatus.PROCESSING
        self.save(update_fields=["status", "updated_at"])

    def mark_completed(self, result: dict) -> None:
        self.status = AIJobStatus.COMPLETED
        self.result = result
        self.save(update_fields=["status", "result", "updated_at"])

    def mark_failed(self, error_message: str) -> None:
        self.status = AIJobStatus.FAILED
        self.error_message = error_message[:2000]
        self.save(update_fields=["status", "error_message", "updated_at"])
