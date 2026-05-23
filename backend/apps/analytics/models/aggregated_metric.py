from django.db import models
from apps.authentication.models import AppUser
from apps.analytics.constants import SNAPSHOT_TYPE_CHOICES, SNAPSHOT_TYPE_SURVEY


class AggregatedMetric(models.Model):
    """
    Stores a single pre-computed metric value for a survey or campaign.
    Supports incremental aggregation and historical comparisons.
    """

    owner = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="aggregated_metrics",
    )

    # Which entity this metric belongs to
    entity_type = models.CharField(
        max_length=50,
        choices=SNAPSHOT_TYPE_CHOICES,
        default=SNAPSHOT_TYPE_SURVEY,
    )
    entity_id = models.PositiveIntegerField(
        help_text="Primary key of the related survey or campaign.",
    )

    # The metric itself
    metric_name = models.CharField(
        max_length=100,
        help_text="Identifier for the metric (e.g. 'total_responses').",
    )
    metric_value = models.FloatField(default=0.0)

    # Optional time bucket for time-series aggregation
    bucket_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date bucket for time-series aggregation (daily granularity).",
    )

    computed_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "analytics_aggregated_metrics"
        indexes = [
            models.Index(fields=["entity_type", "entity_id"]),
            models.Index(fields=["owner"]),
            models.Index(fields=["metric_name"]),
            models.Index(fields=["bucket_date"]),
        ]
        ordering = ["-computed_at"]

    def __str__(self):
        return f"{self.metric_name}={self.metric_value} ({self.entity_type}:{self.entity_id})"
