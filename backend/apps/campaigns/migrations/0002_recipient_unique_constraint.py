from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("campaigns", "0001_initial"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="recipient",
            index=models.Index(fields=["audience"], name="recipients_audience_idx"),
        ),
        migrations.AddConstraint(
            model_name="recipient",
            constraint=models.UniqueConstraint(
                fields=("audience", "email"),
                name="unique_recipient_per_audience",
            ),
        ),
    ]
