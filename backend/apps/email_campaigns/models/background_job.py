"""
BackgroundJob model — tracks async task execution via Trigger.dev.

Each time a background job is enqueued, a record is created here so that:
- the API can return a job_id immediately (async response pattern)
- execution status is visible in PostgreSQL for auditing
- failures and retries are recorded with error details

Statuses mirror the Trigger.dev task lifecycle.
"""

from django.db import models


class BackgroundJob(models.Model):
    """Persistent record of a background task execution."""

    STATUS_QUEUED = "queued"
    STATUS_RUNNING = "running"
    STATUS_COMPLETED = "completed"
    STATUS_FAILED = "failed"
    STATUS_RETRYING = "retrying"

    STATUS_CHOICES = [
        (STATUS_QUEUED, "Queued"),
        (STATUS_RUNNING, "Running"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_FAILED, "Failed"),
        (STATUS_RETRYING, "Retrying"),
    ]

    # Trigger.dev task ID, e.g. "send-campaign"
    task_id = models.CharField(max_length=100, db_index=True)

    # Trigger.dev's run ID, populated after the task is enqueued
    trigger_job_id = models.CharField(max_length=255, blank=True, default="", db_index=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_QUEUED,
        db_index=True,
    )

    # Minimal payload passed to the task (e.g. {"campaignId": 1})
    payload = models.JSONField(default=dict)

    # Result returned by the task on success
    result = models.JSONField(null=True, blank=True)

    # Error detail on failure
    error_message = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "email_campaigns"
        db_table = "email_campaigns_background_job"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["task_id", "status"]),
            models.Index(fields=["status", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"BackgroundJob({self.task_id}, {self.status}, pk={self.pk})"

    def mark_running(self, trigger_job_id: str = "") -> None:
        self.status = self.STATUS_RUNNING
        if trigger_job_id:
            self.trigger_job_id = trigger_job_id
        self.save(update_fields=["status", "trigger_job_id", "updated_at"])

    def mark_completed(self, result: dict | None = None) -> None:
        self.status = self.STATUS_COMPLETED
        self.result = result or {}
        self.save(update_fields=["status", "result", "updated_at"])

    def mark_failed(self, error_message: str = "") -> None:
        self.status = self.STATUS_FAILED
        self.error_message = error_message
        self.save(update_fields=["status", "error_message", "updated_at"])
