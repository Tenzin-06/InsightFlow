from django.db import models
from apps.authentication.models import AppUser


class MetricCache(models.Model):
    """
    DB-backed fallback cache for computed analytics metrics.
    Used when Redis is unavailable. Allows the analytics engine
    to avoid re-computing expensive queries on every request.
    """

    owner = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="metric_caches",
    )

    cache_key = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text="Namespaced cache key (e.g. 'analytics:dashboard:42').",
    )

    payload = models.JSONField(
        default=dict,
        help_text="Serialized cached payload.",
    )

    # TTL support: entries older than expires_at are considered stale
    expires_at = models.DateTimeField(
        help_text="When this cache entry expires.",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "analytics_metric_cache"
        indexes = [
            models.Index(fields=["expires_at"]),
        ]
        ordering = ["-updated_at"]

    def __str__(self):
        return f"MetricCache({self.cache_key})"
