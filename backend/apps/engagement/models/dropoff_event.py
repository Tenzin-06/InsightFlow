from django.db import models


class DropoffEvent(models.Model):
    event = models.OneToOneField(
        "engagement.EngagementEvent",
        related_name="dropoff_detail",
        on_delete=models.CASCADE,
    )
    response_session = models.OneToOneField(
        "engagement.ResponseSession",
        related_name="dropoff_event",
        on_delete=models.CASCADE,
    )
    survey = models.ForeignKey(
        "surveys.Survey",
        related_name="dropoff_events",
        on_delete=models.CASCADE,
    )
    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="dropoff_events",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    last_question_seen = models.ForeignKey(
        "surveys.Question",
        related_name="+",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    completion_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    inactivity_minutes = models.PositiveIntegerField(default=30)
    detected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "engagement_dropoff_events"
        indexes = [
            models.Index(fields=["survey"], name="engagement_survey_47bb5e_idx"),
            models.Index(fields=["campaign"], name="engagement_campaign_a82ce3_idx"),
            models.Index(fields=["detected_at"], name="engagement_detecte_aefec7_idx"),
        ]
        ordering = ["-detected_at"]
