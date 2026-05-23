from dataclasses import dataclass

from django.conf import settings


class SimulationConstraintError(ValueError):
    pass


@dataclass(frozen=True)
class SimulationLimits:
    enabled: bool
    max_responses: int
    max_ai_jobs: int
    max_runtime_minutes: int
    max_concurrent_runs: int
    allow_external_api: bool


class SimulationConstraints:
    @staticmethod
    def current_limits() -> SimulationLimits:
        return SimulationLimits(
            enabled=getattr(settings, "SIMULATION_MODE_ENABLED", True),
            max_responses=getattr(settings, "SIMULATION_MAX_RESPONSES", 10000),
            max_ai_jobs=getattr(settings, "SIMULATION_MAX_AI_JOBS", 25),
            max_runtime_minutes=getattr(settings, "SIMULATION_MAX_RUNTIME_MINUTES", 60),
            max_concurrent_runs=getattr(settings, "SIMULATION_MAX_CONCURRENT_RUNS", 2),
            allow_external_api=getattr(settings, "SIMULATION_ALLOW_EXTERNAL_API", False),
        )

    @classmethod
    def validate_request(
        cls,
        *,
        requested_responses: int,
        ai_job_limit: int,
        runtime_limit_minutes: int,
        allow_external_api: bool,
        active_run_count: int,
    ) -> None:
        limits = cls.current_limits()
        if not limits.enabled:
            raise SimulationConstraintError("Simulation Mode is disabled.")
        if requested_responses > limits.max_responses:
            raise SimulationConstraintError("Requested synthetic response count exceeds the configured limit.")
        if ai_job_limit > limits.max_ai_jobs:
            raise SimulationConstraintError("Requested AI workload exceeds the configured limit.")
        if runtime_limit_minutes > limits.max_runtime_minutes:
            raise SimulationConstraintError("Requested runtime exceeds the configured limit.")
        if allow_external_api and not limits.allow_external_api:
            raise SimulationConstraintError("External API access is disabled for simulation runs.")
        if active_run_count >= limits.max_concurrent_runs:
            raise SimulationConstraintError("Maximum concurrent simulation runs reached.")

