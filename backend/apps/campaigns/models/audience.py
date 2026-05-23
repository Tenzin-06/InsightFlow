from django.db import models
from apps.authentication.models import AppUser


class Audience(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="audiences",
    )
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "audiences"
        indexes = [
            models.Index(fields=["owner"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "owner"],
                name="unique_audience_name_per_owner",
            )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
