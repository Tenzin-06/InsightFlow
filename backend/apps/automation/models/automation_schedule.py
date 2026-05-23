from django.db import models

from apps.automation.constants import (
    AUTOMATION_STATUS_CHOICES,
    AUTOMATION_STATUS_SCHEDULED,
    AUTOMATION_TYPE_CHOICES,
    AUTOMATION_TYPE_SCHEDULED_CAMPAIGN,
)


class AutomationSchedule(models.Model):
    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="automation_schedules",
        on_delete=models.CASCADE,
    )
    owner = models.ForeignKey(
        "authentication.AppUser",
        related_name="automation_schedules",
        on_delete=models.CASCADE,
    )
    automation_type = models.CharField(
        max_length=40,
        choices=AUTOMATION_TYPE_CHOICES,
        default=AUTOMATION_TYPE_SCHEDULED_CAMPAIGN,
    )
    status = models.CharField(
        max_length=20,
        choices=AUTOMATION_STATUS_CHOICES,
        default=AUTOMATION_STATUS_SCHEDULED,
    )
    scheduled_for = models.DateTimeField()
    executed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    trigger_job_id = models.CharField(max_length=255, blank=True)
    result = models.JSONField(default=dict, blank=True)
    error_message = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "automation_schedules"
        indexes = [
            models.Index(fields=["campaign"]),
            models.Index(fields=["owner"]),
            models.Index(fields=["status"]),
            models.Index(fields=["scheduled_for"]),
            models.Index(fields=["automation_type", "status"]),
        ]
        ordering = ["-scheduled_for"]

    def __str__(self):
        return f"{self.campaign_id} {self.automation_type} at {self.scheduled_for}"

