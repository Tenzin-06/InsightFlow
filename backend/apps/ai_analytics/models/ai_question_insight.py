from django.db import models

from apps.ai_analytics.constants import AI_STATUS_CHOICES, AI_STATUS_COMPLETED


class AIQuestionInsight(models.Model):
    """
    AI-generated insight for a single survey question.

    Captures common themes, sentiment summary, friction indicators,
    and answer diversity for the answers received on one question.
    """

    survey = models.ForeignKey(
        "surveys.Survey",
        on_delete=models.CASCADE,
        related_name="ai_question_insights",
    )
    question = models.ForeignKey(
        "surveys.Question",
        on_delete=models.CASCADE,
        related_name="ai_insights",
    )
    owner = models.ForeignKey(
        "authentication.AppUser",
        on_delete=models.CASCADE,
        related_name="ai_question_insights",
    )

    # Question context
    question_text = models.TextField(
        help_text="Snapshot of the question text at analysis time."
    )

    # AI-generated content
    themes = models.JSONField(
        default=list,
        help_text="Common themes identified across answers to this question.",
    )
    sentiment_summary = models.TextField(
        blank=True,
        help_text="One-sentence sentiment summary for this question's answers.",
    )
    friction_indicators = models.JSONField(
        default=list,
        help_text="Pain points or friction signals identified in answers.",
    )
    answer_diversity = models.JSONField(
        default=dict,
        help_text=(
            '{"description": "...", "diversity_level": "high|medium|low"}'
        ),
    )

    # Processing metadata
    answer_count = models.PositiveIntegerField(
        default=0,
        help_text="Number of answers analysed.",
    )
    status = models.CharField(
        max_length=20,
        choices=AI_STATUS_CHOICES,
        default=AI_STATUS_COMPLETED,
    )
    processing_metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ai_question_insights"
        ordering = ["question__order", "-created_at"]
        indexes = [
            models.Index(fields=["survey"], name="ai_qinsight_survey_idx"),
            models.Index(fields=["question"], name="ai_qinsight_question_idx"),
            models.Index(fields=["owner"], name="ai_qinsight_owner_idx"),
        ]

    def __str__(self) -> str:
        return (
            f"AIQuestionInsight survey={self.survey_id} "
            f"question={self.question_id}"
        )
