from django.db import models
from apps.authentication.models import AppUser
from apps.surveys.models.survey import Survey
from apps.campaigns.constants import CAMPAIGN_STATUS_CHOICES, CAMPAIGN_STATUS_DRAFT


class Campaign(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    survey = models.ForeignKey(
        Survey,
        related_name="campaigns",
        on_delete=models.CASCADE,
    )
    owner = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="campaigns",
    )
    status = models.CharField(
        max_length=50,
        choices=CAMPAIGN_STATUS_CHOICES,
        default=CAMPAIGN_STATUS_DRAFT,
    )
    audiences = models.ManyToManyField(
        "campaigns.Audience",
        related_name="campaign_set",
        blank=True,
    )
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "campaigns"
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["owner"]),
            models.Index(fields=["survey"]),
            models.Index(fields=["created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
