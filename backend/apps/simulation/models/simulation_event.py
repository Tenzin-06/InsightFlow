from django.db import models

from apps.authentication.models import AppUser
from apps.simulation.constants.simulation_constants import (
    SIMULATION_ACTION_CHOICES,
    SIMULATION_ACTION_CREATED,
    SIMULATION_EVENT_STATUS_CHOICES,
    SIMULATION_EVENT_STATUS_INFO,
)


class SimulationEvent(models.Model):
    simulation_run = models.ForeignKey(
        "simulation.SimulationRun",
        on_delete=models.CASCADE,
        related_name="events",
        null=True,
        blank=True,
    )
    owner = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="simulation_events",
    )
    actor = models.ForeignKey(
        AppUser,
        on_delete=models.SET_NULL,
        related_name="simulation_audit_events",
        null=True,
        blank=True,
    )
    action_type = models.CharField(
        max_length=80,
        choices=SIMULATION_ACTION_CHOICES,
        default=SIMULATION_ACTION_CREATED,
        db_index=True,
    )
    status = models.CharField(
        max_length=20,
        choices=SIMULATION_EVENT_STATUS_CHOICES,
        default=SIMULATION_EVENT_STATUS_INFO,
        db_index=True,
    )
    message = models.TextField(blank=True, default="")
    metadata = models.JSONField(default=dict, blank=True)
    is_simulated = models.BooleanField(default=True, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "simulation_events"
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["simulation_run", "timestamp"]),
            models.Index(fields=["owner", "timestamp"]),
            models.Index(fields=["action_type", "status"]),
            models.Index(fields=["is_simulated"]),
        ]

    def __str__(self) -> str:
        return f"SimulationEvent(id={self.pk}, action={self.action_type})"

