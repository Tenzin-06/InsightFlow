from django.db import models

from apps.automation.constants import (
    REMINDER_DELAY_CHOICES,
    REMINDER_TYPE_CHOICES,
    REMINDER_TYPE_FRIENDLY,
)


class ReminderRule(models.Model):
    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="reminder_rules",
        on_delete=models.CASCADE,
    )
    owner = models.ForeignKey(
        "authentication.AppUser",
        related_name="reminder_rules",
        on_delete=models.CASCADE,
    )
    delay_days = models.PositiveSmallIntegerField(choices=REMINDER_DELAY_CHOICES)
    reminder_type = models.CharField(
        max_length=30,
        choices=REMINDER_TYPE_CHOICES,
        default=REMINDER_TYPE_FRIENDLY,
    )
    max_reminders = models.PositiveSmallIntegerField(default=1)
    is_enabled = models.BooleanField(default=True)
    recipient_email = models.EmailField(blank=True)
    reminder_count = models.PositiveSmallIntegerField(default=0)
    last_reminder_at = models.DateTimeField(null=True, blank=True)
    responded_after_reminder = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reminder_rules"
        indexes = [
            models.Index(fields=["campaign"]),
            models.Index(fields=["owner"]),
            models.Index(fields=["delay_days"]),
            models.Index(fields=["is_enabled"]),
            models.Index(fields=["recipient_email"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["campaign", "delay_days", "recipient_email"],
                name="unique_campaign_delay_recipient_reminder",
            )
        ]
        ordering = ["delay_days", "recipient_email"]

    def __str__(self):
        scope = self.recipient_email or "campaign"
        return f"{scope} reminder after {self.delay_days} day(s)"

