from django.db import models


class Recipient(models.Model):
    audience = models.ForeignKey(
        "campaigns.Audience",
        related_name="recipients",
        on_delete=models.CASCADE,
    )
    email = models.EmailField()
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "recipients"
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["audience"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["audience", "email"],
                name="unique_recipient_per_audience",
            )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return self.email
