from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0001_initial"),
    ]

    operations = [
        # Drop Clerk-specific field
        migrations.RemoveField(
            model_name="appuser",
            name="clerk_user_id",
        ),
        # Add hashed password storage
        migrations.AddField(
            model_name="appuser",
            name="password",
            field=models.CharField(max_length=255, default=""),
            preserve_default=False,
        ),
        # Add active flag
        migrations.AddField(
            model_name="appuser",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
    ]
