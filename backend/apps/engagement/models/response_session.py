import uuid

from django.db import models


class ResponseSession(models.Model):
    session_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="response_sessions",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    survey = models.ForeignKey(
        "surveys.Survey",
        related_name="response_sessions",
        on_delete=models.CASCADE,
    )
    recipient = models.ForeignKey(
        "campaigns.Recipient",
        related_name="response_sessions",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    recipient_email = models.EmailField(blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    current_question = models.ForeignKey(
        "surveys.Question",
        related_name="+",
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
    last_activity_at = models.DateTimeField(auto_now=True)
    answered_questions_count = models.PositiveIntegerField(default=0)
    total_questions_count = models.PositiveIntegerField(default=0)
    completion_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    dropped_off_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "engagement_response_sessions"
        indexes = [
            models.Index(fields=["session_id"], name="engagement_session_1e87bd_idx"),
            models.Index(fields=["campaign"], name="engagement_campaign_9d6039_idx"),
            models.Index(fields=["survey"], name="engagement_survey_3c893a_idx"),
            models.Index(fields=["completed_at"], name="engagement_complete_074cc5_idx"),
            models.Index(fields=["last_activity_at"], name="engagement_last_ac_f4e645_idx"),
            models.Index(fields=["dropped_off_at"], name="engagement_dropped_4f320f_idx"),
        ]
        ordering = ["-last_activity_at"]

    def __str__(self):
        return str(self.session_id)
