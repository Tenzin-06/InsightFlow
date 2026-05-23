from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("campaigns", "0002_recipient_unique_constraint"),
    ]

    operations = [
        migrations.AddField(
            model_name="campaign",
            name="subject",
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name="campaign",
            name="template_name",
            field=models.CharField(
                choices=[
                    ("survey_invitation", "Survey Invitation"),
                    ("reminder_email", "Reminder Email"),
                    ("test_email", "Test Email"),
                ],
                default="survey_invitation",
                max_length=50,
            ),
        ),
    ]
