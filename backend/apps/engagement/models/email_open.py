from django.db import models


class EmailOpen(models.Model):
    event = models.OneToOneField(
        "engagement.EngagementEvent",
        related_name="email_open",
        on_delete=models.CASCADE,
    )
    tracking_token = models.ForeignKey(
        "engagement.TrackingToken",
        related_name="email_opens",
        on_delete=models.CASCADE,
    )
    opened_at = models.DateTimeField(auto_now_add=True)
    user_agent_summary = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "engagement_email_opens"
        indexes = [
            models.Index(fields=["tracking_token"], name="engagement_tracking_357749_idx"),
            models.Index(fields=["opened_at"], name="engagement_opened_86ec66_idx"),
        ]
        ordering = ["-opened_at"]
