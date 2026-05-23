# Generated for Unit 36 PDF report backend.

import uuid

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("authentication", "0002_update_appuser_local_auth"),
        ("surveys", "0002_survey_slug"),
    ]

    operations = [
        migrations.CreateModel(
            name="ReportExport",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "template",
                    models.CharField(
                        choices=[
                            ("executive_summary", "Executive Summary"),
                            ("academic_report", "Academic Report"),
                            ("campaign_report", "Campaign Report"),
                            ("ai_insight_report", "AI Insights Report"),
                        ],
                        max_length=64,
                    ),
                ),
                ("sections", models.JSONField(default=list)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("queued", "Queued"),
                            ("preparing", "Preparing"),
                            ("processing_assets", "Processing Assets"),
                            ("rendering", "Rendering"),
                            ("finalizing", "Finalizing"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                        ],
                        default="queued",
                        max_length=32,
                    ),
                ),
                ("progress", models.PositiveSmallIntegerField(default=0)),
                ("file_path", models.CharField(blank=True, max_length=512)),
                ("download_token", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("download_expires_at", models.DateTimeField(blank=True, null=True)),
                ("error_message", models.TextField(blank=True)),
                ("analytics_snapshot", models.JSONField(blank=True, default=dict)),
                ("ai_snapshot", models.JSONField(blank=True, default=dict)),
                ("asset_manifest", models.JSONField(blank=True, default=dict)),
                ("completed_at", models.DateTimeField(blank=True, null=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="report_exports",
                        to="authentication.appuser",
                    ),
                ),
                (
                    "survey",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="report_exports",
                        to="surveys.survey",
                    ),
                ),
            ],
            options={
                "db_table": "report_exports",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="reportexport",
            index=models.Index(fields=["owner"], name="report_export_owner_idx"),
        ),
        migrations.AddIndex(
            model_name="reportexport",
            index=models.Index(fields=["survey"], name="report_export_survey_idx"),
        ),
        migrations.AddIndex(
            model_name="reportexport",
            index=models.Index(fields=["status"], name="report_export_status_idx"),
        ),
        migrations.AddIndex(
            model_name="reportexport",
            index=models.Index(fields=["download_token"], name="report_export_token_idx"),
        ),
        migrations.AddIndex(
            model_name="reportexport",
            index=models.Index(fields=["created_at"], name="report_export_created_idx"),
        ),
    ]
