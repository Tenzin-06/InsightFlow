import uuid
from django.db import migrations, models
from django.utils.text import slugify


def populate_slugs(apps, schema_editor):
    Survey = apps.get_model("surveys", "Survey")
    for survey in Survey.objects.filter(slug__isnull=True):
        base = slugify(survey.title)[:200]
        suffix = str(uuid.uuid4())[:8]
        survey.slug = f"{base}-{suffix}" if base else suffix
        survey.save(update_fields=["slug"])


class Migration(migrations.Migration):

    dependencies = [
        ("surveys", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="survey",
            name="slug",
            field=models.SlugField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.RunPython(populate_slugs, migrations.RunPython.noop),
    ]
