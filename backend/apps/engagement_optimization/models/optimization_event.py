from django.db import models

from apps.engagement_optimization.constants import (
    OPT_EVENT_REMINDER_SENT,
    OPT_EVENT_TYPE_CHOICES,
)


class OptimizationEvent(models.Model):
    """
    Audit record for every optimization action executed against a recipient.
    """

    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="optimization_events",
        on_delete=models.CASCADE,
    )
    optimization_rule = models.ForeignKey(
        "engagement_optimization.OptimizationRule",
        related_name="events",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    recipient_email = models.EmailField()
    event_type = models.CharField(
        max_length=40,
        choices=OPT_EVENT_TYPE_CHOICES,
        default=OPT_EVENT_REMINDER_SENT,
    )
    triggered_at = models.DateTimeField(auto_now_add=True)
    outcome = models.CharField(max_length=120, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "opt_optimization_events"
        indexes = [
            models.Index(fields=["campaign"], name="opt_event_campaign_idx"),
            models.Index(fields=["recipient_email"], name="opt_event_recipient_idx"),
            models.Index(fields=["event_type"], name="opt_event_type_idx"),
            models.Index(fields=["triggered_at"], name="opt_event_triggered_idx"),
        ]
        ordering = ["-triggered_at"]

    def __str__(self):
        return f"{self.event_type} → {self.recipient_email} (campaign {self.campaign_id})"
