from django.db import models

from apps.ai_analytics.constants import (
    AI_STATUS_CHOICES,
    AI_STATUS_COMPLETED,
    SENTIMENT_CHOICES,
    SENTIMENT_NEUTRAL,
)


class AISentiment(models.Model):
    """
    AI-generated sentiment analysis for a survey's responses.

    Stores the distribution of positive/neutral/negative sentiment,
    the dominant sentiment label, and a confidence score.
    """

    survey = models.ForeignKey(
        "surveys.Survey",
        on_delete=models.CASCADE,
        related_name="ai_sentiments",
    )
    owner = models.ForeignKey(
        "authentication.AppUser",
        on_delete=models.CASCADE,
        related_name="ai_sentiments",
    )

    # AI-generated content
    sentiment_distribution = models.JSONField(
        default=dict,
        help_text=(
            "Fractional breakdown: "
            '{"positive": 0.6, "neutral": 0.25, "negative": 0.15}'
        ),
    )
    dominant_sentiment = models.CharField(
        max_length=20,
        choices=SENTIMENT_CHOICES,
        default=SENTIMENT_NEUTRAL,
        help_text="The prevailing sentiment category.",
    )
    overall_confidence = models.FloatField(
        default=0.0,
        help_text="Confidence score for the sentiment analysis (0.0–1.0).",
    )
    reasoning = models.TextField(
        blank=True,
        help_text="One-sentence AI reasoning for the dominant sentiment.",
    )

    # Processing metadata
    response_count = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=AI_STATUS_CHOICES,
        default=AI_STATUS_COMPLETED,
    )
    processing_metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ai_sentiments"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["survey"], name="ai_sentiment_survey_idx"),
            models.Index(fields=["owner"], name="ai_sentiment_owner_idx"),
            models.Index(fields=["created_at"], name="ai_sentiment_created_idx"),
        ]

    def __str__(self) -> str:
        return (
            f"AISentiment survey={self.survey_id} "
            f"dominant={self.dominant_sentiment}"
        )
