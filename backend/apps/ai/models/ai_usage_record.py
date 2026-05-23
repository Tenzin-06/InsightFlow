"""
AIUsageRecord — tracks token consumption and cost per AI API call.

One record is written for every successful provider response so that
token usage, latency, and future billing can be monitored platform-wide.
"""

from django.db import models
from apps.core.models import TimeStampedModel


class AIUsageRecord(TimeStampedModel):
    """
    Token usage and cost record for a single AI provider call.

    Fields
    ------
    job            : The parent AIJob (nullable — in case the job is deleted).
    model_name     : Provider model used (e.g. "gemini-1.5-flash").
    tokens_used    : Total tokens consumed (prompt + completion).
    request_type   : Operation category (text_generation, summarization, …).
    execution_time : End-to-end provider call duration in seconds.
    estimated_cost : Optional future billing estimate (USD, 6 dp).
    """

    job = models.ForeignKey(
        "ai.AIJob",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="usage_records",
        db_index=True,
    )
    model_name = models.CharField(max_length=100, db_index=True)
    tokens_used = models.PositiveIntegerField(default=0)
    request_type = models.CharField(max_length=50, db_index=True)
    execution_time = models.FloatField(default=0.0)  # seconds
    estimated_cost = models.DecimalField(
        max_digits=10, decimal_places=6, null=True, blank=True
    )

    class Meta:
        app_label = "ai"
        db_table = "ai_usage_records"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["model_name", "created_at"]),
            models.Index(fields=["request_type", "created_at"]),
        ]

    def __str__(self) -> str:
        return (
            f"AIUsageRecord(model={self.model_name}, tokens={self.tokens_used}, "
            f"type={self.request_type})"
        )
