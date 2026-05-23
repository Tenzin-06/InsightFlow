from django.db import models


class LinkClick(models.Model):
    event = models.OneToOneField(
        "engagement.EngagementEvent",
        related_name="link_click",
        on_delete=models.CASCADE,
    )
    tracking_token = models.ForeignKey(
        "engagement.TrackingToken",
        related_name="link_clicks",
        on_delete=models.CASCADE,
    )
    destination_url = models.URLField(max_length=1000)
    clicked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "engagement_link_clicks"
        indexes = [
            models.Index(fields=["tracking_token"], name="engagement_tracking_48f34c_idx"),
            models.Index(fields=["clicked_at"], name="engagement_clicked_db6652_idx"),
        ]
        ordering = ["-clicked_at"]
