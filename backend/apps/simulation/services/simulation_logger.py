import logging

from apps.simulation.constants.simulation_constants import (
    SIMULATION_ACTION_BLOCKED,
    SIMULATION_EVENT_STATUS_BLOCKED,
    SIMULATION_EVENT_STATUS_FAILED,
    SIMULATION_EVENT_STATUS_INFO,
    SIMULATION_EVENT_STATUS_SUCCESS,
)
from apps.simulation.models import SimulationEvent

logger = logging.getLogger("apps.simulation")


class SimulationLogger:
    @staticmethod
    def log_event(
        *,
        owner,
        action_type: str,
        simulation_run=None,
        actor=None,
        status: str = SIMULATION_EVENT_STATUS_INFO,
        message: str = "",
        metadata: dict | None = None,
    ) -> SimulationEvent:
        event = SimulationEvent.objects.create(
            owner=owner,
            actor=actor,
            simulation_run=simulation_run,
            action_type=action_type,
            status=status,
            message=message,
            metadata=metadata or {},
        )
        logger.info(
            "simulation_event action=%s status=%s run_id=%s owner_id=%s",
            action_type,
            status,
            getattr(simulation_run, "id", None),
            getattr(owner, "id", None),
        )
        return event

    @classmethod
    def log_success(cls, **kwargs) -> SimulationEvent:
        return cls.log_event(status=SIMULATION_EVENT_STATUS_SUCCESS, **kwargs)

    @classmethod
    def log_failure(cls, **kwargs) -> SimulationEvent:
        return cls.log_event(status=SIMULATION_EVENT_STATUS_FAILED, **kwargs)

    @classmethod
    def log_blocked(cls, *, owner, simulation_run=None, actor=None, message: str = "", metadata: dict | None = None):
        return cls.log_event(
            owner=owner,
            actor=actor,
            simulation_run=simulation_run,
            action_type=SIMULATION_ACTION_BLOCKED,
            status=SIMULATION_EVENT_STATUS_BLOCKED,
            message=message,
            metadata=metadata,
        )

