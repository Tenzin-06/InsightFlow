from django.db.models import Q

from apps.simulation.constants.simulation_constants import SIMULATION_RUN_STATUS_PENDING, SIMULATION_RUN_STATUS_RUNNING
from apps.simulation.schemas import SimulationRunRequestSchema
from apps.simulation.services.simulation_constraints import SimulationConstraints
from apps.surveys.models.survey import Survey


class SimulationValidationError(ValueError):
    pass


class SimulationValidator:
    @staticmethod
    def validate_payload(payload: dict) -> SimulationRunRequestSchema:
        try:
            return SimulationRunRequestSchema.model_validate(payload)
        except Exception as exc:
            raise SimulationValidationError(str(exc)) from exc

    @staticmethod
    def validate_survey_ownership(*, survey_id: int, owner) -> Survey:
        try:
            return Survey.objects.get(pk=survey_id, owner=owner)
        except Survey.DoesNotExist as exc:
            raise SimulationValidationError("Survey not found or not owned by the current user.") from exc

    @staticmethod
    def validate_request(*, payload: dict, owner):
        parsed = SimulationValidator.validate_payload(payload)
        survey = SimulationValidator.validate_survey_ownership(
            survey_id=parsed.survey_id,
            owner=owner,
        )
        from apps.simulation.models import SimulationRun

        active_run_count = SimulationRun.objects.filter(
            owner=owner,
        ).filter(
            Q(status=SIMULATION_RUN_STATUS_PENDING) | Q(status=SIMULATION_RUN_STATUS_RUNNING)
        ).count()
        SimulationConstraints.validate_request(
            requested_responses=parsed.requested_responses,
            ai_job_limit=parsed.ai_job_limit,
            runtime_limit_minutes=parsed.runtime_limit_minutes,
            allow_external_api=parsed.allow_external_api,
            active_run_count=active_run_count,
        )
        return parsed, survey

