import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("authentication", "0002_update_appuser_local_auth"),
        ("surveys", "0002_survey_slug"),
    ]

    operations = [
        migrations.CreateModel(
            name="AISummary",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "summary",
                    models.TextField(
                        help_text="AI-generated narrative summary of survey responses."
                    ),
                ),
                (
                    "themes",
                    models.JSONField(
                        default=list,
                        help_text="List of recurring themes identified by AI.",
                    ),
                ),
                (
                    "response_count",
                    models.PositiveIntegerField(
                        default=0,
                        help_text="Number of responses processed to generate this summary.",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("processing", "Processing"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                        ],
                        default="completed",
                        max_length=20,
                    ),
                ),
                (
                    "processing_metadata",
                    models.JSONField(
                        blank=True,
                        default=dict,
                        help_text="Execution metadata: model, tokens, latency, etc.",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_summaries",
                        to="authentication.appuser",
                    ),
                ),
                (
                    "survey",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_summaries",
                        to="surveys.survey",
                    ),
                ),
            ],
            options={
                "db_table": "ai_summaries",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="AISentiment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "sentiment_distribution",
                    models.JSONField(
                        default=dict,
                        help_text=(
                            'Fractional breakdown: '
                            '{"positive": 0.6, "neutral": 0.25, "negative": 0.15}'
                        ),
                    ),
                ),
                (
                    "dominant_sentiment",
                    models.CharField(
                        choices=[
                            ("positive", "Positive"),
                            ("neutral", "Neutral"),
                            ("negative", "Negative"),
                            ("mixed", "Mixed"),
                        ],
                        default="neutral",
                        help_text="The prevailing sentiment category.",
                        max_length=20,
                    ),
                ),
                (
                    "overall_confidence",
                    models.FloatField(
                        default=0.0,
                        help_text="Confidence score for the sentiment analysis (0.0–1.0).",
                    ),
                ),
                (
                    "reasoning",
                    models.TextField(
                        blank=True,
                        help_text="One-sentence AI reasoning for the dominant sentiment.",
                    ),
                ),
                ("response_count", models.PositiveIntegerField(default=0)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("processing", "Processing"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                        ],
                        default="completed",
                        max_length=20,
                    ),
                ),
                (
                    "processing_metadata",
                    models.JSONField(blank=True, default=dict),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_sentiments",
                        to="authentication.appuser",
                    ),
                ),
                (
                    "survey",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_sentiments",
                        to="surveys.survey",
                    ),
                ),
            ],
            options={
                "db_table": "ai_sentiments",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="AIQualityScore",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "average_score",
                    models.FloatField(
                        default=0.0,
                        help_text="Average quality score across all evaluated responses (0–100).",
                    ),
                ),
                (
                    "high_quality_count",
                    models.PositiveIntegerField(
                        default=0, help_text="Responses scoring 70–100."
                    ),
                ),
                (
                    "medium_quality_count",
                    models.PositiveIntegerField(
                        default=0, help_text="Responses scoring 40–69."
                    ),
                ),
                (
                    "low_quality_count",
                    models.PositiveIntegerField(
                        default=0, help_text="Responses scoring 0–39."
                    ),
                ),
                (
                    "suspicious_count",
                    models.PositiveIntegerField(
                        default=0,
                        help_text="Responses flagged as suspicious or spam.",
                    ),
                ),
                (
                    "response_count",
                    models.PositiveIntegerField(
                        default=0,
                        help_text="Total number of responses evaluated.",
                    ),
                ),
                (
                    "score_breakdown",
                    models.JSONField(
                        blank=True,
                        default=list,
                        help_text="Per-response score details: [{response_id, score, category, flags}]",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("processing", "Processing"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                        ],
                        default="completed",
                        max_length=20,
                    ),
                ),
                (
                    "processing_metadata",
                    models.JSONField(blank=True, default=dict),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_quality_scores",
                        to="authentication.appuser",
                    ),
                ),
                (
                    "survey",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_quality_scores",
                        to="surveys.survey",
                    ),
                ),
            ],
            options={
                "db_table": "ai_quality_scores",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="AIQuestionInsight",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "question_text",
                    models.TextField(
                        help_text="Snapshot of the question text at analysis time."
                    ),
                ),
                (
                    "themes",
                    models.JSONField(
                        default=list,
                        help_text="Common themes identified across answers to this question.",
                    ),
                ),
                (
                    "sentiment_summary",
                    models.TextField(
                        blank=True,
                        help_text="One-sentence sentiment summary for this question's answers.",
                    ),
                ),
                (
                    "friction_indicators",
                    models.JSONField(
                        default=list,
                        help_text="Pain points or friction signals identified in answers.",
                    ),
                ),
                (
                    "answer_diversity",
                    models.JSONField(
                        default=dict,
                        help_text='{"description": "...", "diversity_level": "high|medium|low"}',
                    ),
                ),
                (
                    "answer_count",
                    models.PositiveIntegerField(
                        default=0,
                        help_text="Number of answers analysed.",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("processing", "Processing"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                        ],
                        default="completed",
                        max_length=20,
                    ),
                ),
                (
                    "processing_metadata",
                    models.JSONField(blank=True, default=dict),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_question_insights",
                        to="authentication.appuser",
                    ),
                ),
                (
                    "question",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_insights",
                        to="surveys.question",
                    ),
                ),
                (
                    "survey",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ai_question_insights",
                        to="surveys.survey",
                    ),
                ),
            ],
            options={
                "db_table": "ai_question_insights",
                "ordering": ["question__order", "-created_at"],
            },
        ),
        # ── Indexes ──────────────────────────────────────────────────────────────
        migrations.AddIndex(
            model_name="aisummary",
            index=models.Index(fields=["survey"], name="ai_summary_survey_idx"),
        ),
        migrations.AddIndex(
            model_name="aisummary",
            index=models.Index(fields=["owner"], name="ai_summary_owner_idx"),
        ),
        migrations.AddIndex(
            model_name="aisummary",
            index=models.Index(fields=["created_at"], name="ai_summary_created_idx"),
        ),
        migrations.AddIndex(
            model_name="aisentiment",
            index=models.Index(fields=["survey"], name="ai_sentiment_survey_idx"),
        ),
        migrations.AddIndex(
            model_name="aisentiment",
            index=models.Index(fields=["owner"], name="ai_sentiment_owner_idx"),
        ),
        migrations.AddIndex(
            model_name="aisentiment",
            index=models.Index(fields=["created_at"], name="ai_sentiment_created_idx"),
        ),
        migrations.AddIndex(
            model_name="aiqualityscore",
            index=models.Index(fields=["survey"], name="ai_quality_survey_idx"),
        ),
        migrations.AddIndex(
            model_name="aiqualityscore",
            index=models.Index(fields=["owner"], name="ai_quality_owner_idx"),
        ),
        migrations.AddIndex(
            model_name="aiqualityscore",
            index=models.Index(fields=["created_at"], name="ai_quality_created_idx"),
        ),
        migrations.AddIndex(
            model_name="aiquestioninsight",
            index=models.Index(fields=["survey"], name="ai_qinsight_survey_idx"),
        ),
        migrations.AddIndex(
            model_name="aiquestioninsight",
            index=models.Index(fields=["question"], name="ai_qinsight_question_idx"),
        ),
        migrations.AddIndex(
            model_name="aiquestioninsight",
            index=models.Index(fields=["owner"], name="ai_qinsight_owner_idx"),
        ),
    ]
