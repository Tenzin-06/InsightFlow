import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("authentication", "0002_update_appuser_local_auth"),
        ("campaigns", "0003_campaign_email_fields"),
    ]

    operations = [
        migrations.CreateModel(
            name="OptimizationRule",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("rule_name", models.CharField(max_length=120)),
                (
                    "trigger_type",
                    models.CharField(
                        choices=[
                            ("non_response", "Non-Response"),
                            ("dropoff_detected", "Drop-Off Detected"),
                        ],
                        default="non_response",
                        max_length=40,
                    ),
                ),
                (
                    "delay_days",
                    models.PositiveSmallIntegerField(
                        default=3,
                        help_text="Days after original send before triggering follow-up.",
                    ),
                ),
                (
                    "reminder_limit",
                    models.PositiveSmallIntegerField(
                        default=1,
                        help_text="Maximum number of follow-up reminders this rule may send per recipient.",
                    ),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="optimization_rules",
                        to="authentication.appuser",
                    ),
                ),
                (
                    "campaign",
                    models.ForeignKey(
                        blank=True,
                        help_text="If set, rule applies only to this campaign.",
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="optimization_rules",
                        to="campaigns.campaign",
                    ),
                ),
            ],
            options={
                "db_table": "opt_optimization_rules",
                "ordering": ["rule_name"],
            },
        ),
        migrations.CreateModel(
            name="OptimizationEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("recipient_email", models.EmailField()),
                (
                    "event_type",
                    models.CharField(
                        choices=[
                            ("reminder_sent", "Reminder Sent"),
                            ("segment_changed", "Segment Changed"),
                            ("automation_skipped", "Automation Skipped"),
                        ],
                        default="reminder_sent",
                        max_length=40,
                    ),
                ),
                ("triggered_at", models.DateTimeField(auto_now_add=True)),
                ("outcome", models.CharField(blank=True, max_length=120)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                (
                    "campaign",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="optimization_events",
                        to="campaigns.campaign",
                    ),
                ),
                (
                    "optimization_rule",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="events",
                        to="engagement_optimization.optimizationrule",
                    ),
                ),
            ],
            options={
                "db_table": "opt_optimization_events",
                "ordering": ["-triggered_at"],
            },
        ),
        migrations.CreateModel(
            name="EngagementSegment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("recipient_email", models.EmailField()),
                (
                    "segment_type",
                    models.CharField(
                        choices=[
                            ("completed", "Completed"),
                            ("opened_not_clicked", "Opened Not Clicked"),
                            ("clicked_not_started", "Clicked Not Started"),
                            ("started_not_completed", "Started Not Completed"),
                            ("inactive", "Inactive"),
                        ],
                        default="inactive",
                        max_length=40,
                    ),
                ),
                ("previous_segment", models.CharField(blank=True, max_length=40)),
                ("assigned_at", models.DateTimeField(auto_now=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                (
                    "campaign",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="engagement_segments",
                        to="campaigns.campaign",
                    ),
                ),
            ],
            options={
                "db_table": "opt_engagement_segments",
                "ordering": ["-assigned_at"],
            },
        ),
        migrations.CreateModel(
            name="FollowupExecution",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("recipient_email", models.EmailField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("evaluating", "Evaluating"),
                            ("optimized", "Optimized"),
                            ("skipped", "Skipped"),
                            ("failed", "Failed"),
                        ],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("executed_at", models.DateTimeField(blank=True, null=True)),
                ("error_message", models.TextField(blank=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "campaign",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="followup_executions",
                        to="campaigns.campaign",
                    ),
                ),
                (
                    "optimization_rule",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="executions",
                        to="engagement_optimization.optimizationrule",
                    ),
                ),
            ],
            options={
                "db_table": "opt_followup_executions",
                "ordering": ["-created_at"],
            },
        ),
        # --- indexes ---
        migrations.AddIndex(
            model_name="optimizationrule",
            index=models.Index(fields=["owner"], name="opt_rule_owner_idx"),
        ),
        migrations.AddIndex(
            model_name="optimizationrule",
            index=models.Index(fields=["campaign"], name="opt_rule_campaign_idx"),
        ),
        migrations.AddIndex(
            model_name="optimizationrule",
            index=models.Index(fields=["trigger_type"], name="opt_rule_trigger_idx"),
        ),
        migrations.AddIndex(
            model_name="optimizationrule",
            index=models.Index(fields=["is_active"], name="opt_rule_active_idx"),
        ),
        migrations.AddIndex(
            model_name="optimizationevent",
            index=models.Index(fields=["campaign"], name="opt_event_campaign_idx"),
        ),
        migrations.AddIndex(
            model_name="optimizationevent",
            index=models.Index(fields=["recipient_email"], name="opt_event_recipient_idx"),
        ),
        migrations.AddIndex(
            model_name="optimizationevent",
            index=models.Index(fields=["event_type"], name="opt_event_type_idx"),
        ),
        migrations.AddIndex(
            model_name="optimizationevent",
            index=models.Index(fields=["triggered_at"], name="opt_event_triggered_idx"),
        ),
        migrations.AddConstraint(
            model_name="engagementsegment",
            constraint=models.UniqueConstraint(
                fields=("campaign", "recipient_email"),
                name="unique_campaign_recipient_segment",
            ),
        ),
        migrations.AddIndex(
            model_name="engagementsegment",
            index=models.Index(fields=["campaign"], name="opt_seg_campaign_idx"),
        ),
        migrations.AddIndex(
            model_name="engagementsegment",
            index=models.Index(fields=["recipient_email"], name="opt_seg_recipient_idx"),
        ),
        migrations.AddIndex(
            model_name="engagementsegment",
            index=models.Index(fields=["segment_type"], name="opt_seg_type_idx"),
        ),
        migrations.AddIndex(
            model_name="engagementsegment",
            index=models.Index(fields=["assigned_at"], name="opt_seg_assigned_idx"),
        ),
        migrations.AddIndex(
            model_name="followupexecution",
            index=models.Index(fields=["campaign"], name="opt_exec_campaign_idx"),
        ),
        migrations.AddIndex(
            model_name="followupexecution",
            index=models.Index(fields=["recipient_email"], name="opt_exec_recipient_idx"),
        ),
        migrations.AddIndex(
            model_name="followupexecution",
            index=models.Index(fields=["status"], name="opt_exec_status_idx"),
        ),
        migrations.AddIndex(
            model_name="followupexecution",
            index=models.Index(fields=["executed_at"], name="opt_exec_executed_idx"),
        ),
    ]
