from django.db import transaction

from apps.simulation.constants.simulation_constants import (
    SIMULATION_ACTION_CLEANUP,
    SIMULATION_ACTION_CREATED,
    SIMULATION_ACTION_VALIDATED,
    SIMULATION_RUN_STATUS_ARCHIVED,
)
from apps.simulation.models import SimulationRun
from apps.simulation.services.simulation_isolation import SimulationIsolation
from apps.simulation.services.simulation_logger import SimulationLogger
from apps.simulation.services.simulation_validator import SimulationValidator


class SimulationManager:
    @staticmethod
    @transaction.atomic
    def create_run(*, owner, payload: dict) -> SimulationRun:
        parsed, survey = SimulationValidator.validate_request(payload=payload, owner=owner)
        SimulationLogger.log_success(
            owner=owner,
            actor=owner,
            action_type=SIMULATION_ACTION_VALIDATED,
            message="Simulation request validated.",
            metadata={"survey_id": survey.pk},
        )
        run = SimulationRun.objects.create(
            owner=owner,
            survey=survey,
            run_name=parsed.run_name,
            requested_responses=parsed.requested_responses,
            ai_job_limit=parsed.ai_job_limit,
            runtime_limit_minutes=parsed.runtime_limit_minutes,
            allow_external_api=parsed.allow_external_api,
            metadata=SimulationIsolation.tag_metadata(parsed.metadata),
        )
        SimulationLogger.log_success(
            owner=owner,
            actor=owner,
            simulation_run=run,
            action_type=SIMULATION_ACTION_CREATED,
            message="Simulation run created in isolated pending state.",
        )
        return run

    @staticmethod
    def cleanup_run(*, simulation_run: SimulationRun) -> SimulationRun:
        simulation_run.status = SIMULATION_RUN_STATUS_ARCHIVED
        simulation_run.metadata = {
            **simulation_run.metadata,
            "cleanup_status": "archived",
        }
        simulation_run.save(update_fields=["status", "metadata", "updated_at"])
        SimulationLogger.log_success(
            owner=simulation_run.owner,
            simulation_run=simulation_run,
            action_type=SIMULATION_ACTION_CLEANUP,
            message="Simulation run archived by cleanup workflow.",
        )
        return simulation_run

