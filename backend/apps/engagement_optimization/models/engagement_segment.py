from django.db import models

from apps.engagement_optimization.constants import (
    SEGMENT_INACTIVE,
    SEGMENT_TYPE_CHOICES,
)


class EngagementSegment(models.Model):
    """
    Represents the current engagement segment assigned to a recipient for a
    specific campaign.  Updated whenever the segmentation service re-evaluates.
    """

    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="engagement_segments",
        on_delete=models.CASCADE,
    )
    recipient_email = models.EmailField()
    segment_type = models.CharField(
        max_length=40,
        choices=SEGMENT_TYPE_CHOICES,
        default=SEGMENT_INACTIVE,
    )
    previous_segment = models.CharField(max_length=40, blank=True)
    assigned_at = models.DateTimeField(auto_now=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "opt_engagement_segments"
        constraints = [
            models.UniqueConstraint(
                fields=["campaign", "recipient_email"],
                name="unique_campaign_recipient_segment",
            )
        ]
        indexes = [
            models.Index(fields=["campaign"], name="opt_seg_campaign_idx"),
            models.Index(fields=["recipient_email"], name="opt_seg_recipient_idx"),
            models.Index(fields=["segment_type"], name="opt_seg_type_idx"),
            models.Index(fields=["assigned_at"], name="opt_seg_assigned_idx"),
        ]
        ordering = ["-assigned_at"]

    def __str__(self):
        return f"{self.recipient_email} → {self.segment_type} (campaign {self.campaign_id})"
