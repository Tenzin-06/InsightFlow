from django.db import models

from apps.authentication.models import AppUser
from apps.core.models import TimeStampedModel
from apps.surveys.models.survey import Survey


class SimulationConfig(TimeStampedModel):
    owner = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="simulation_configs",
    )
    survey = models.ForeignKey(
        Survey,
        on_delete=models.CASCADE,
        related_name="simulation_configs",
        null=True,
        blank=True,
    )
    config_name = models.CharField(max_length=255)
    is_enabled = models.BooleanField(default=True)
    max_responses = models.PositiveIntegerField(default=10000)
    max_ai_jobs = models.PositiveIntegerField(default=25)
    max_runtime_minutes = models.PositiveIntegerField(default=60)
    max_concurrent_runs = models.PositiveIntegerField(default=2)
    allow_external_api = models.BooleanField(default=False)
    is_simulated = models.BooleanField(default=True, editable=False)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "simulation_configs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["owner", "is_enabled"]),
            models.Index(fields=["survey"]),
            models.Index(fields=["is_simulated"]),
        ]

    def __str__(self) -> str:
        return self.config_name

