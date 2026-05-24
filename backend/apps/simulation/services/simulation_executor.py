import logging

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

logger = logging.getLogger("apps.simulation")


class SimulationExecutor:
    @staticmethod
    @transaction.atomic
    def execute(simulation_run):
        SimulationIsolation.assert_isolated_object(simulation_run, label="Simulation run")
        SimulationGuard.validate_run_safety(simulation_run)

        simulation_run.mark_running()

        # Generate AI responses via Gemini
        try:
            from apps.simulation.services.gemini_simulation_service import (
                GeminiSimulationService,
            )
            ai_responses = GeminiSimulationService.generate_all_responses(simulation_run)
            total_responses = sum(len(r.get("responses", [])) for r in ai_responses)
            generation_note = f"Generated {total_responses} AI responses across {len(ai_responses)} persona(s)."
        except Exception as exc:
            logger.warning(
                "SimulationExecutor: Gemini generation failed for run %s: %s — storing empty dataset",
                simulation_run.pk,
                exc,
            )
            ai_responses = []
            total_responses = 0
            generation_note = f"AI generation failed: {str(exc)[:200]}"

        dataset_metadata = SimulationIsolation.tag_metadata(
            {
                "status": "completed",
                "generated_records": total_responses,
                "persona_count": len(ai_responses),
                "responses": ai_responses,
                "note": generation_note,
            }
        )

        dataset = SyntheticDataset.objects.create(
            owner=simulation_run.owner,
            simulation_run=simulation_run,
            dataset_name=f"{simulation_run.run_name} — AI responses",
            dataset_type=DATASET_TYPE_ANALYTICS,
            generated_by=GENERATED_BY_SYSTEM,
            metadata=dataset_metadata,
        )

        SimulationIsolation.assert_isolated_object(dataset, label="Synthetic dataset")

        simulation_run.mark_completed(
            {
                "execution_context": "sandboxed",
                "synthetic_dataset_id": dataset.pk,
                "external_api_allowed": simulation_run.allow_external_api,
                "generated_records": total_responses,
            }
        )

        SimulationLogger.log_success(
            owner=simulation_run.owner,
            simulation_run=simulation_run,
            action_type=SIMULATION_ACTION_EXECUTED,
            message=generation_note,
            metadata={"dataset_id": dataset.pk, "generated_records": total_responses},
        )

        return simulation_run
