from django.db import models
from apps.email_campaigns.constants import DELIVERY_STATUS_CHOICES, DELIVERY_STATUS_PENDING


class DeliveryLog(models.Model):
    """
    Records the outcome of a single email delivery attempt
    for a campaign recipient.
    """

    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="delivery_logs",
        on_delete=models.CASCADE,
    )
    recipient_email = models.EmailField()
    recipient_first_name = models.CharField(max_length=255, blank=True)
    status = models.CharField(
        max_length=20,
        choices=DELIVERY_STATUS_CHOICES,
        default=DELIVERY_STATUS_PENDING,
    )
    provider_message_id = models.CharField(max_length=255, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "email_delivery_logs"
        indexes = [
            models.Index(fields=["campaign"]),
            models.Index(fields=["status"]),
            models.Index(fields=["recipient_email"]),
            models.Index(fields=["sent_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.recipient_email} — {self.status}"
