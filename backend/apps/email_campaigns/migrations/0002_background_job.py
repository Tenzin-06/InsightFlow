from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("email_campaigns", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="BackgroundJob",
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
                ("task_id", models.CharField(db_index=True, max_length=100)),
                (
                    "trigger_job_id",
                    models.CharField(blank=True, db_index=True, default="", max_length=255),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("queued", "Queued"),
                            ("running", "Running"),
                            ("completed", "Completed"),
                            ("failed", "Failed"),
                            ("retrying", "Retrying"),
                        ],
                        db_index=True,
                        default="queued",
                        max_length=20,
                    ),
                ),
                ("payload", models.JSONField(default=dict)),
                ("result", models.JSONField(blank=True, null=True)),
                ("error_message", models.TextField(blank=True, default="")),
                ("created_at", models.DateTimeField(auto_now_add=True, db_index=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "email_campaigns_background_job",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="backgroundjob",
            index=models.Index(
                fields=["task_id", "status"],
                name="ec_bgjob_task_status_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="backgroundjob",
            index=models.Index(
                fields=["status", "created_at"],
                name="ec_bgjob_status_created_idx",
            ),
        ),
    ]
