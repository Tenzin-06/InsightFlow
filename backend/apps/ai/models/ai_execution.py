"""
AIExecution — records each individual attempt to run an AIJob.

A single AIJob may spawn multiple executions when retries occur.
"""

from django.db import models
from apps.core.models import TimeStampedModel


class AIExecution(TimeStampedModel):
    """
    Tracks one execution attempt for a parent AIJob.

    Fields
    ------
    job            : The parent AI job this execution belongs to.
    model_name     : Which AI model was used (e.g. "gemini-1.5-flash").
    prompt_preview : First 500 chars of the prompt sent to the provider.
    raw_response   : First 2 000 chars of the raw provider response.
    started_at     : When the provider call began.
    completed_at   : When the provider call ended (success or failure).
    attempt_number : 1-based retry counter.
    success        : Whether this execution produced a usable result.
    error_message  : Provider or parsing error if success == False.
    """

    job = models.ForeignKey(
        "ai.AIJob",
        on_delete=models.CASCADE,
        related_name="executions",
        db_index=True,
    )
    model_name = models.CharField(max_length=100, blank=True, default="")
    prompt_preview = models.TextField(blank=True, default="")
    raw_response = models.TextField(blank=True, default="")
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    attempt_number = models.PositiveSmallIntegerField(default=1)
    success = models.BooleanField(default=False)
    error_message = models.TextField(blank=True, default="")

    class Meta:
        app_label = "ai"
        db_table = "ai_executions"
        ordering = ["attempt_number"]
        indexes = [
            models.Index(fields=["job", "attempt_number"]),
            models.Index(fields=["success"]),
        ]

    def __str__(self) -> str:
        return (
            f"AIExecution(job={self.job_id}, attempt={self.attempt_number}, "
            f"success={self.success})"
        )
