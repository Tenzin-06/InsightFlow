from django.db import models

from apps.engagement.constants import EVENT_TYPE_CHOICES


class EngagementEvent(models.Model):
    event_type = models.CharField(max_length=50, choices=EVENT_TYPE_CHOICES)
    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="engagement_events",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    survey = models.ForeignKey(
        "surveys.Survey",
        related_name="engagement_events",
        on_delete=models.CASCADE,
    )
    recipient = models.ForeignKey(
        "campaigns.Recipient",
        related_name="engagement_events",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    recipient_email = models.EmailField(blank=True)
    response_session = models.ForeignKey(
        "engagement.ResponseSession",
        related_name="events",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    tracking_token = models.ForeignKey(
        "engagement.TrackingToken",
        related_name="events",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    session_id = models.UUIDField(null=True, blank=True)
    unique_key = models.CharField(max_length=255, unique=True, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    user_agent = models.TextField(blank=True)
    ip_hash = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "engagement_events"
        indexes = [
            models.Index(fields=["event_type"], name="engagement_event_t_a8eb0b_idx"),
            models.Index(fields=["campaign", "event_type"], name="engagement_campaign_32b3cf_idx"),
            models.Index(fields=["survey", "event_type"], name="engagement_survey_a014cf_idx"),
            models.Index(fields=["recipient", "event_type"], name="eng_evt_recipient_3a4ba9_idx"),
            models.Index(fields=["session_id"], name="engagement_session_5f8c04_idx"),
            models.Index(fields=["created_at"], name="engagement_created_c2f78a_idx"),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.event_type}:{self.pk}"
