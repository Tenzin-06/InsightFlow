from django.db import models

from apps.engagement_optimization.constants import (
    EXECUTION_STATUS_CHOICES,
    EXECUTION_STATUS_PENDING,
)


class FollowupExecution(models.Model):
    """
    Tracks the lifecycle state of each follow-up execution attempt
    for an optimization rule applied to a specific recipient.
    """

    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="followup_executions",
        on_delete=models.CASCADE,
    )
    optimization_rule = models.ForeignKey(
        "engagement_optimization.OptimizationRule",
        related_name="executions",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    recipient_email = models.EmailField()
    status = models.CharField(
        max_length=20,
        choices=EXECUTION_STATUS_CHOICES,
        default=EXECUTION_STATUS_PENDING,
    )
    executed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "opt_followup_executions"
        indexes = [
            models.Index(fields=["campaign"], name="opt_exec_campaign_idx"),
            models.Index(fields=["recipient_email"], name="opt_exec_recipient_idx"),
            models.Index(fields=["status"], name="opt_exec_status_idx"),
            models.Index(fields=["executed_at"], name="opt_exec_executed_idx"),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"FollowupExecution({self.status}) {self.recipient_email} campaign {self.campaign_id}"
