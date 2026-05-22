from django.db import models
from apps.authentication.models import AppUser
from apps.core.models import TimeStampedModel

SURVEY_STATUS_DRAFT = "draft"
SURVEY_STATUS_PUBLISHED = "published"
SURVEY_STATUS_ARCHIVED = "archived"

SURVEY_STATUS_CHOICES = [
    (SURVEY_STATUS_DRAFT, "Draft"),
    (SURVEY_STATUS_PUBLISHED, "Published"),
    (SURVEY_STATUS_ARCHIVED, "Archived"),
]


class Survey(TimeStampedModel):
    owner = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="surveys",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=SURVEY_STATUS_CHOICES,
        default=SURVEY_STATUS_DRAFT,
    )
    is_public = models.BooleanField(default=False)

    class Meta:
        db_table = "surveys"
        indexes = [
            models.Index(fields=["owner"]),
            models.Index(fields=["status"]),
            models.Index(fields=["created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
