from django.db import models
from django.utils import timezone

from apps.authentication.models import AppUser
from apps.core.models import TimeStampedModel
from apps.simulation.constants.simulation_constants import (
    SIMULATION_RUN_STATUS_BLOCKED,
    SIMULATION_RUN_STATUS_CHOICES,
    SIMULATION_RUN_STATUS_COMPLETED,
    SIMULATION_RUN_STATUS_FAILED,
    SIMULATION_RUN_STATUS_PENDING,
    SIMULATION_RUN_STATUS_RUNNING,
)
from apps.surveys.models.survey import Survey


class SimulationRun(TimeStampedModel):
    owner = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="simulation_runs",
    )
    survey = models.ForeignKey(
        Survey,
        on_delete=models.CASCADE,
        related_name="simulation_runs",
    )
    config = models.ForeignKey(
        "simulation.SimulationConfig",
        on_delete=models.SET_NULL,
        related_name="runs",
        null=True,
        blank=True,
    )
    run_name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=SIMULATION_RUN_STATUS_CHOICES,
        default=SIMULATION_RUN_STATUS_PENDING,
        db_index=True,
    )
    requested_responses = models.PositiveIntegerField(default=0)
    ai_job_limit = models.PositiveIntegerField(default=0)
    runtime_limit_minutes = models.PositiveIntegerField(default=60)
    allow_external_api = models.BooleanField(default=False)
    is_simulated = models.BooleanField(default=True, editable=False)
    metadata = models.JSONField(default=dict, blank=True)
    error_message = models.TextField(blank=True, default="")
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "simulation_runs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["owner", "status"]),
            models.Index(fields=["survey", "status"]),
            models.Index(fields=["is_simulated"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self) -> str:
        return f"SimulationRun(id={self.pk}, status={self.status})"

    def mark_running(self) -> None:
        self.status = SIMULATION_RUN_STATUS_RUNNING
        self.started_at = timezone.now()
        self.save(update_fields=["status", "started_at", "updated_at"])

    def mark_completed(self, metadata: dict | None = None) -> None:
        self.status = SIMULATION_RUN_STATUS_COMPLETED
        self.completed_at = timezone.now()
        if metadata is not None:
            self.metadata = {**self.metadata, **metadata}
        self.save(update_fields=["status", "completed_at", "metadata", "updated_at"])

    def mark_failed(self, error_message: str) -> None:
        self.status = SIMULATION_RUN_STATUS_FAILED
        self.error_message = error_message[:2000]
        self.completed_at = timezone.now()
        self.save(update_fields=["status", "error_message", "completed_at", "updated_at"])

    def mark_blocked(self, reason: str) -> None:
        self.status = SIMULATION_RUN_STATUS_BLOCKED
        self.error_message = reason[:2000]
        self.completed_at = timezone.now()
        self.save(update_fields=["status", "error_message", "completed_at", "updated_at"])

