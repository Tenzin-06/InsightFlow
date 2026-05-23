from django.db import models

from apps.ai_analytics.constants import AI_STATUS_CHOICES, AI_STATUS_COMPLETED


class AISummary(models.Model):
    """
    AI-generated summary of open-ended survey responses.

    Stores the overall narrative summary and extracted themes
    produced by Gemini for a given survey.
    """

    survey = models.ForeignKey(
        "surveys.Survey",
        on_delete=models.CASCADE,
        related_name="ai_summaries",
    )
    owner = models.ForeignKey(
        "authentication.AppUser",
        on_delete=models.CASCADE,
        related_name="ai_summaries",
    )

    # AI-generated content
    summary = models.TextField(
        help_text="AI-generated narrative summary of survey responses."
    )
    themes = models.JSONField(
        default=list,
        help_text="List of recurring themes identified by AI.",
    )

    # Processing metadata
    response_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of responses processed to generate this summary.",
    )
    status = models.CharField(
        max_length=20,
        choices=AI_STATUS_CHOICES,
        default=AI_STATUS_COMPLETED,
    )
    processing_metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Execution metadata: model, tokens, latency, etc.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ai_summaries"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["survey"], name="ai_summary_survey_idx"),
            models.Index(fields=["owner"], name="ai_summary_owner_idx"),
            models.Index(fields=["created_at"], name="ai_summary_created_idx"),
        ]

    def __str__(self) -> str:
        return f"AISummary survey={self.survey_id} owner={self.owner_id}"
