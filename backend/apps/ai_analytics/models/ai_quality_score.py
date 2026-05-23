from django.db import models

from apps.ai_analytics.constants import AI_STATUS_CHOICES, AI_STATUS_COMPLETED


class AIQualityScore(models.Model):
    """
    AI-generated quality evaluation for a survey's responses.

    Aggregates per-response quality scores across the whole survey,
    providing counts in each quality tier and the average score.
    """

    survey = models.ForeignKey(
        "surveys.Survey",
        on_delete=models.CASCADE,
        related_name="ai_quality_scores",
    )
    owner = models.ForeignKey(
        "authentication.AppUser",
        on_delete=models.CASCADE,
        related_name="ai_quality_scores",
    )

    # Aggregate quality metrics
    average_score = models.FloatField(
        default=0.0,
        help_text="Average quality score across all evaluated responses (0–100).",
    )
    high_quality_count = models.PositiveIntegerField(
        default=0,
        help_text="Responses scoring 70–100.",
    )
    medium_quality_count = models.PositiveIntegerField(
        default=0,
        help_text="Responses scoring 40–69.",
    )
    low_quality_count = models.PositiveIntegerField(
        default=0,
        help_text="Responses scoring 0–39.",
    )
    suspicious_count = models.PositiveIntegerField(
        default=0,
        help_text="Responses flagged as suspicious or spam.",
    )
    response_count = models.PositiveIntegerField(
        default=0,
        help_text="Total number of responses evaluated.",
    )

    # Detailed per-response scores (optional, stored for reprocessing)
    score_breakdown = models.JSONField(
        default=list,
        blank=True,
        help_text="Per-response score details: [{response_id, score, category, flags}]",
    )

    # Processing metadata
    status = models.CharField(
        max_length=20,
        choices=AI_STATUS_CHOICES,
        default=AI_STATUS_COMPLETED,
    )
    processing_metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ai_quality_scores"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["survey"], name="ai_quality_survey_idx"),
            models.Index(fields=["owner"], name="ai_quality_owner_idx"),
            models.Index(fields=["created_at"], name="ai_quality_created_idx"),
        ]

    def __str__(self) -> str:
        return (
            f"AIQualityScore survey={self.survey_id} "
            f"avg={self.average_score:.1f}"
        )
