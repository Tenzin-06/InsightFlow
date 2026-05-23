from django.db import models

from apps.automation.constants import AUTOMATION_EVENT_CHOICES


class AutomationEvent(models.Model):
    schedule = models.ForeignKey(
        "automation.AutomationSchedule",
        related_name="events",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="automation_events",
        on_delete=models.CASCADE,
    )
    owner = models.ForeignKey(
        "authentication.AppUser",
        related_name="automation_events",
        on_delete=models.CASCADE,
    )
    event_type = models.CharField(max_length=40, choices=AUTOMATION_EVENT_CHOICES)
    recipient_email = models.EmailField(blank=True)
    message = models.CharField(max_length=500, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "automation_events"
        indexes = [
            models.Index(fields=["schedule"]),
            models.Index(fields=["campaign"]),
            models.Index(fields=["owner"]),
            models.Index(fields=["event_type"]),
            models.Index(fields=["recipient_email"]),
            models.Index(fields=["created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.event_type} for campaign {self.campaign_id}"
