import uuid

from django.db import models


class TrackingToken(models.Model):
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="tracking_tokens",
        on_delete=models.CASCADE,
    )
    survey = models.ForeignKey(
        "surveys.Survey",
        related_name="tracking_tokens",
        on_delete=models.CASCADE,
    )
    recipient = models.ForeignKey(
        "campaigns.Recipient",
        related_name="tracking_tokens",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    recipient_email = models.EmailField(blank=True)
    destination_url = models.URLField(max_length=1000)
    is_active = models.BooleanField(default=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "engagement_tracking_tokens"
        indexes = [
            models.Index(fields=["token"], name="engagement_token_2d6e7a_idx"),
            models.Index(fields=["campaign"], name="engagement_campaign_2fe7dd_idx"),
            models.Index(fields=["survey"], name="engagement_survey_b16e6a_idx"),
            models.Index(fields=["recipient"], name="eng_tok_recipient_51055e_idx"),
            models.Index(fields=["created_at"], name="engagement_created_1551f0_idx"),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return str(self.token)
