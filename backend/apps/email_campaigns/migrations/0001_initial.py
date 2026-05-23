from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("campaigns", "0003_campaign_email_fields"),
    ]

    operations = [
        migrations.CreateModel(
            name="DeliveryLog",
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
                ("recipient_email", models.EmailField()),
                ("recipient_first_name", models.CharField(blank=True, max_length=255)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "Pending"),
                            ("sent", "Sent"),
                            ("failed", "Failed"),
                        ],
                        default="pending",
                        max_length=20,
                    ),
                ),
                ("provider_message_id", models.CharField(blank=True, max_length=255)),
                ("sent_at", models.DateTimeField(blank=True, null=True)),
                ("error_message", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "campaign",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="delivery_logs",
                        to="campaigns.campaign",
                    ),
                ),
            ],
            options={
                "db_table": "email_delivery_logs",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="deliverylog",
            index=models.Index(
                fields=["campaign"], name="email_deliv_campaig_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="deliverylog",
            index=models.Index(
                fields=["status"], name="email_deliv_status_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="deliverylog",
            index=models.Index(
                fields=["recipient_email"], name="email_deliv_recipie_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="deliverylog",
            index=models.Index(
                fields=["sent_at"], name="email_deliv_sent_at_idx"
            ),
        ),
    ]
