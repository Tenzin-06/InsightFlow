from django.db import models

from apps.authentication.models import AppUser
from apps.core.models import TimeStampedModel
from apps.simulation.constants.simulation_constants import (
    DATASET_TYPE_CHOICES,
    DATASET_TYPE_RESPONSE,
    GENERATED_BY_CHOICES,
    GENERATED_BY_SYSTEM,
)


class SyntheticDataset(TimeStampedModel):
    owner = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="synthetic_datasets",
    )
    simulation_run = models.ForeignKey(
        "simulation.SimulationRun",
        on_delete=models.CASCADE,
        related_name="synthetic_datasets",
    )
    dataset_name = models.CharField(max_length=255)
    dataset_type = models.CharField(
        max_length=80,
        choices=DATASET_TYPE_CHOICES,
        default=DATASET_TYPE_RESPONSE,
        db_index=True,
    )
    generated_by = models.CharField(
        max_length=20,
        choices=GENERATED_BY_CHOICES,
        default=GENERATED_BY_SYSTEM,
    )
    is_simulated = models.BooleanField(default=True, editable=False)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "synthetic_datasets"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["simulation_run", "dataset_type"]),
            models.Index(fields=["owner", "created_at"]),
            models.Index(fields=["is_simulated"]),
        ]

    def __str__(self) -> str:
        return self.dataset_name

