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
            name="AutomationSchedule",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "automation_type",
                    models.CharField(
                        choices=[
                            ("scheduled_campaign", "Scheduled Campaign"),
                            ("reminder", "Reminder"),
                        ],
                        default="scheduled_campaign",
                        max_length=40,
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("scheduled", "Scheduled"),
                            ("running", "Running"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                            ("cancelled", "Cancelled"),
                        ],
                        default="scheduled",
                        max_length=20,
                    ),
                ),
                ("scheduled_for", models.DateTimeField()),
                ("executed_at", models.DateTimeField(blank=True, null=True)),
                ("cancelled_at", models.DateTimeField(blank=True, null=True)),
                ("trigger_job_id", models.CharField(blank=True, max_length=255)),
                ("result", models.JSONField(blank=True, default=dict)),
                ("error_message", models.TextField(blank=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "campaign",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="automation_schedules",
                        to="campaigns.campaign",
                    ),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="automation_schedules",
                        to="authentication.appuser",
                    ),
                ),
            ],
            options={
                "db_table": "automation_schedules",
                "ordering": ["-scheduled_for"],
            },
        ),
        migrations.CreateModel(
            name="ReminderRule",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("delay_days", models.PositiveSmallIntegerField(choices=[(1, "1 day"), (3, "3 days"), (7, "7 days")])),
                (
                    "reminder_type",
                    models.CharField(
                        choices=[
                            ("friendly", "Friendly Reminder"),
                            ("final", "Final Reminder"),
                            ("conversational", "Conversational Reminder"),
                        ],
                        default="friendly",
                        max_length=30,
                    ),
                ),
                ("max_reminders", models.PositiveSmallIntegerField(default=1)),
                ("is_enabled", models.BooleanField(default=True)),
                ("recipient_email", models.EmailField(blank=True, max_length=254)),
                ("reminder_count", models.PositiveSmallIntegerField(default=0)),
                ("last_reminder_at", models.DateTimeField(blank=True, null=True)),
                ("responded_after_reminder", models.BooleanField(default=False)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "campaign",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reminder_rules",
                        to="campaigns.campaign",
                    ),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="reminder_rules",
                        to="authentication.appuser",
                    ),
                ),
            ],
            options={
                "db_table": "reminder_rules",
                "ordering": ["delay_days", "recipient_email"],
            },
        ),
        migrations.CreateModel(
            name="AutomationEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "event_type",
                    models.CharField(
                        choices=[
                            ("scheduled", "Scheduled"),
                            ("started", "Started"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                            ("cancelled", "Cancelled"),
                            ("reminder_sent", "Reminder Sent"),
                            ("reminder_skipped", "Reminder Skipped"),
                        ],
                        max_length=40,
                    ),
                ),
                ("recipient_email", models.EmailField(blank=True, max_length=254)),
                ("message", models.CharField(blank=True, max_length=500)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "campaign",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="automation_events",
                        to="campaigns.campaign",
                    ),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="automation_events",
                        to="authentication.appuser",
                    ),
                ),
                (
                    "schedule",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="events",
                        to="automation.automationschedule",
                    ),
                ),
            ],
            options={
                "db_table": "automation_events",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(model_name="automationschedule", index=models.Index(fields=["campaign"], name="automation__campaig_idx")),
        migrations.AddIndex(model_name="automationschedule", index=models.Index(fields=["owner"], name="automation__owner_i_idx")),
        migrations.AddIndex(model_name="automationschedule", index=models.Index(fields=["status"], name="automation__status_idx")),
        migrations.AddIndex(model_name="automationschedule", index=models.Index(fields=["scheduled_for"], name="automation__schedul_idx")),
        migrations.AddIndex(model_name="automationschedule", index=models.Index(fields=["automation_type", "status"], name="automation__automat_idx")),
        migrations.AddIndex(model_name="reminderrule", index=models.Index(fields=["campaign"], name="reminder_ru_campaig_idx")),
        migrations.AddIndex(model_name="reminderrule", index=models.Index(fields=["owner"], name="reminder_ru_owner_i_idx")),
        migrations.AddIndex(model_name="reminderrule", index=models.Index(fields=["delay_days"], name="reminder_ru_delay_d_idx")),
        migrations.AddIndex(model_name="reminderrule", index=models.Index(fields=["is_enabled"], name="reminder_ru_is_enab_idx")),
        migrations.AddIndex(model_name="reminderrule", index=models.Index(fields=["recipient_email"], name="reminder_ru_recipie_idx")),
        migrations.AddConstraint(
            model_name="reminderrule",
            constraint=models.UniqueConstraint(
                fields=("campaign", "delay_days", "recipient_email"),
                name="unique_campaign_delay_recipient_reminder",
            ),
        ),
        migrations.AddIndex(model_name="automationevent", index=models.Index(fields=["schedule"], name="automation__schedul_evt_idx")),
        migrations.AddIndex(model_name="automationevent", index=models.Index(fields=["campaign"], name="automation__campaig_evt_idx")),
        migrations.AddIndex(model_name="automationevent", index=models.Index(fields=["owner"], name="automation__owner_e_idx")),
        migrations.AddIndex(model_name="automationevent", index=models.Index(fields=["event_type"], name="automation__event_t_idx")),
        migrations.AddIndex(model_name="automationevent", index=models.Index(fields=["recipient_email"], name="automation__recipie_idx")),
        migrations.AddIndex(model_name="automationevent", index=models.Index(fields=["created_at"], name="automation__created_idx")),
    ]
