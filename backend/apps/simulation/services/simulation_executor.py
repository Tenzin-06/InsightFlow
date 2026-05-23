from django.db import transaction

from apps.simulation.constants.simulation_constants import (
    DATASET_TYPE_ANALYTICS,
    GENERATED_BY_SYSTEM,
    SIMULATION_ACTION_EXECUTED,
)
from apps.simulation.models import SyntheticDataset
from apps.simulation.services.simulation_guard import SimulationGuard
from apps.simulation.services.simulation_isolation import SimulationIsolation
from apps.simulation.services.simulation_logger import SimulationLogger


class SimulationExecutor:
    @staticmethod
    @transaction.atomic
    def execute(simulation_run):
        SimulationIsolation.assert_isolated_object(simulation_run, label="Simulation run")
        SimulationGuard.validate_run_safety(simulation_run)

        simulation_run.mark_running()

        dataset = SyntheticDataset.objects.create(
            owner=simulation_run.owner,
            simulation_run=simulation_run,
            dataset_name=f"{simulation_run.run_name} - isolated analytics workspace",
            dataset_type=DATASET_TYPE_ANALYTICS,
            generated_by=GENERATED_BY_SYSTEM,
            metadata=SimulationIsolation.tag_metadata(
                {
                    "status": "initialized",
                    "generated_records": 0,
                    "note": "Synthetic respondent generation is deferred to a future unit.",
                }
            ),
        )

        SimulationIsolation.assert_isolated_object(dataset, label="Synthetic dataset")
        simulation_run.mark_completed(
            {
                "execution_context": "sandboxed",
                "synthetic_dataset_id": dataset.pk,
                "external_api_allowed": simulation_run.allow_external_api,
            }
        )
        SimulationLogger.log_success(
            owner=simulation_run.owner,
            simulation_run=simulation_run,
            action_type=SIMULATION_ACTION_EXECUTED,
            message="Simulation infrastructure execution completed in isolated mode.",
            metadata={"dataset_id": dataset.pk},
        )
        return simulation_run

