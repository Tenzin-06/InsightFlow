from django.db import models
from apps.authentication.models import AppUser
from apps.analytics.constants import SNAPSHOT_TYPE_CHOICES, SNAPSHOT_TYPE_SURVEY


class AnalyticsSnapshot(models.Model):
    """
    Pre-computed analytics payload for a survey, campaign, or dashboard.
    Supports on-demand computation with future support for scheduled snapshots,
    hourly aggregation, and daily summaries.
    """

    owner = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="analytics_snapshots",
    )

    snapshot_type = models.CharField(
        max_length=50,
        choices=SNAPSHOT_TYPE_CHOICES,
        default=SNAPSHOT_TYPE_SURVEY,
        db_index=True,
    )

    # Identifies which survey, campaign, or entity this snapshot covers.
    # Null for dashboard-level (user-wide) snapshots.
    entity_id = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="PK of the related entity. Null for user-wide snapshots.",
    )

    # Full analytics payload (metrics, charts, trends, segments)
    payload = models.JSONField(
        default=dict,
        help_text="Serialized analytics payload ready for dashboard consumption.",
    )

    computed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "analytics_snapshots"
        indexes = [
            models.Index(fields=["owner", "snapshot_type"]),
            models.Index(fields=["entity_id"]),
            models.Index(fields=["computed_at"]),
        ]
        ordering = ["-computed_at"]

    def __str__(self):
        return (
            f"Snapshot({self.snapshot_type}, entity={self.entity_id}) "
            f"@ {self.computed_at:%Y-%m-%d %H:%M}"
        )
