# Generated manually for Unit 27 engagement tracking.

import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("campaigns", "0003_campaign_email_fields"),
        ("surveys", "0002_survey_slug"),
    ]

    operations = [
        migrations.CreateModel(
            name="TrackingToken",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("token", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("recipient_email", models.EmailField(blank=True, max_length=254)),
                ("destination_url", models.URLField(max_length=1000)),
                ("is_active", models.BooleanField(default=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "campaign",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="tracking_tokens", to="campaigns.campaign"),
                ),
                (
                    "recipient",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="tracking_tokens", to="campaigns.recipient"),
                ),
                (
                    "survey",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="tracking_tokens", to="surveys.survey"),
                ),
            ],
            options={
                "db_table": "engagement_tracking_tokens",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="ResponseSession",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("session_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("recipient_email", models.EmailField(blank=True, max_length=254)),
                ("started_at", models.DateTimeField(auto_now_add=True)),
                ("completed_at", models.DateTimeField(blank=True, null=True)),
                ("last_activity_at", models.DateTimeField(auto_now=True)),
                ("answered_questions_count", models.PositiveIntegerField(default=0)),
                ("total_questions_count", models.PositiveIntegerField(default=0)),
                ("completion_percentage", models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ("dropped_off_at", models.DateTimeField(blank=True, null=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                (
                    "campaign",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="response_sessions", to="campaigns.campaign"),
                ),
                (
                    "current_question",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="surveys.question"),
                ),
                (
                    "last_question_seen",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="surveys.question"),
                ),
                (
                    "recipient",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="response_sessions", to="campaigns.recipient"),
                ),
                (
                    "survey",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="response_sessions", to="surveys.survey"),
                ),
            ],
            options={
                "db_table": "engagement_response_sessions",
                "ordering": ["-last_activity_at"],
            },
        ),
        migrations.CreateModel(
            name="EngagementEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "event_type",
                    models.CharField(
                        choices=[
                            ("email_open", "Email Open"),
                            ("link_click", "Link Click"),
                            ("survey_start", "Survey Start"),
                            ("question_answered", "Question Answered"),
                            ("survey_complete", "Survey Complete"),
                            ("dropoff", "Drop-Off"),
                        ],
                        max_length=50,
                    ),
                ),
                ("recipient_email", models.EmailField(blank=True, max_length=254)),
                ("session_id", models.UUIDField(blank=True, null=True)),
                ("unique_key", models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("user_agent", models.TextField(blank=True)),
                ("ip_hash", models.CharField(blank=True, max_length=64)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "campaign",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="engagement_events", to="campaigns.campaign"),
                ),
                (
                    "recipient",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="engagement_events", to="campaigns.recipient"),
                ),
                (
                    "response_session",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="events", to="engagement.responsesession"),
                ),
                (
                    "survey",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="engagement_events", to="surveys.survey"),
                ),
                (
                    "tracking_token",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="events", to="engagement.trackingtoken"),
                ),
            ],
            options={
                "db_table": "engagement_events",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="EmailOpen",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("opened_at", models.DateTimeField(auto_now_add=True)),
                ("user_agent_summary", models.CharField(blank=True, max_length=255)),
                (
                    "event",
                    models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="email_open", to="engagement.engagementevent"),
                ),
                (
                    "tracking_token",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="email_opens", to="engagement.trackingtoken"),
                ),
            ],
            options={
                "db_table": "engagement_email_opens",
                "ordering": ["-opened_at"],
            },
        ),
        migrations.CreateModel(
            name="LinkClick",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("destination_url", models.URLField(max_length=1000)),
                ("clicked_at", models.DateTimeField(auto_now_add=True)),
                (
                    "event",
                    models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="link_click", to="engagement.engagementevent"),
                ),
                (
                    "tracking_token",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="link_clicks", to="engagement.trackingtoken"),
                ),
            ],
            options={
                "db_table": "engagement_link_clicks",
                "ordering": ["-clicked_at"],
            },
        ),
        migrations.CreateModel(
            name="DropoffEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("completion_percentage", models.DecimalField(decimal_places=2, default=0, max_digits=5)),
                ("inactivity_minutes", models.PositiveIntegerField(default=30)),
                ("detected_at", models.DateTimeField(auto_now_add=True)),
                (
                    "campaign",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="dropoff_events", to="campaigns.campaign"),
                ),
                (
                    "event",
                    models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="dropoff_detail", to="engagement.engagementevent"),
                ),
                (
                    "last_question_seen",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="+", to="surveys.question"),
                ),
                (
                    "response_session",
                    models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="dropoff_event", to="engagement.responsesession"),
                ),
                (
                    "survey",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="dropoff_events", to="surveys.survey"),
                ),
            ],
            options={
                "db_table": "engagement_dropoff_events",
                "ordering": ["-detected_at"],
            },
        ),
        migrations.AddIndex(model_name="trackingtoken", index=models.Index(fields=["token"], name="engagement_token_2d6e7a_idx")),
        migrations.AddIndex(model_name="trackingtoken", index=models.Index(fields=["campaign"], name="engagement_campaign_2fe7dd_idx")),
        migrations.AddIndex(model_name="trackingtoken", index=models.Index(fields=["survey"], name="engagement_survey_b16e6a_idx")),
        migrations.AddIndex(model_name="trackingtoken", index=models.Index(fields=["recipient"], name="eng_tok_recipient_51055e_idx")),
        migrations.AddIndex(model_name="trackingtoken", index=models.Index(fields=["created_at"], name="engagement_created_1551f0_idx")),
        migrations.AddIndex(model_name="responsesession", index=models.Index(fields=["session_id"], name="engagement_session_1e87bd_idx")),
        migrations.AddIndex(model_name="responsesession", index=models.Index(fields=["campaign"], name="engagement_campaign_9d6039_idx")),
        migrations.AddIndex(model_name="responsesession", index=models.Index(fields=["survey"], name="engagement_survey_3c893a_idx")),
        migrations.AddIndex(model_name="responsesession", index=models.Index(fields=["completed_at"], name="engagement_complete_074cc5_idx")),
        migrations.AddIndex(model_name="responsesession", index=models.Index(fields=["last_activity_at"], name="engagement_last_ac_f4e645_idx")),
        migrations.AddIndex(model_name="responsesession", index=models.Index(fields=["dropped_off_at"], name="engagement_dropped_4f320f_idx")),
        migrations.AddIndex(model_name="engagementevent", index=models.Index(fields=["event_type"], name="engagement_event_t_a8eb0b_idx")),
        migrations.AddIndex(model_name="engagementevent", index=models.Index(fields=["campaign", "event_type"], name="engagement_campaign_32b3cf_idx")),
        migrations.AddIndex(model_name="engagementevent", index=models.Index(fields=["survey", "event_type"], name="engagement_survey_a014cf_idx")),
        migrations.AddIndex(model_name="engagementevent", index=models.Index(fields=["recipient", "event_type"], name="eng_evt_recipient_3a4ba9_idx")),
        migrations.AddIndex(model_name="engagementevent", index=models.Index(fields=["session_id"], name="engagement_session_5f8c04_idx")),
        migrations.AddIndex(model_name="engagementevent", index=models.Index(fields=["created_at"], name="engagement_created_c2f78a_idx")),
        migrations.AddIndex(model_name="emailopen", index=models.Index(fields=["tracking_token"], name="engagement_tracking_357749_idx")),
        migrations.AddIndex(model_name="emailopen", index=models.Index(fields=["opened_at"], name="engagement_opened_86ec66_idx")),
        migrations.AddIndex(model_name="linkclick", index=models.Index(fields=["tracking_token"], name="engagement_tracking_48f34c_idx")),
        migrations.AddIndex(model_name="linkclick", index=models.Index(fields=["clicked_at"], name="engagement_clicked_db6652_idx")),
        migrations.AddIndex(model_name="dropoffevent", index=models.Index(fields=["survey"], name="engagement_survey_47bb5e_idx")),
        migrations.AddIndex(model_name="dropoffevent", index=models.Index(fields=["campaign"], name="engagement_campaign_a82ce3_idx")),
        migrations.AddIndex(model_name="dropoffevent", index=models.Index(fields=["detected_at"], name="engagement_detecte_aefec7_idx")),
    ]
