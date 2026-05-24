import logging

from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.simulation.constants.simulation_constants import SIMULATION_RUN_STATUS_PENDING
from apps.simulation.models import SimulationRun
from apps.simulation.serializers import SimulationRunCreateSerializer, SimulationRunSerializer
from apps.simulation.services.simulation_executor import SimulationExecutor
from apps.simulation.services.simulation_guard import SimulationGuardError
from apps.simulation.services.simulation_manager import SimulationManager
from apps.simulation.services.simulation_validator import SimulationValidationError
from apps.simulation.utils import error_response, success_response

logger = logging.getLogger("apps.simulation")


class NoAuthentication(BaseAuthentication):
    def authenticate(self, request: Request):  # type: ignore[override]
        return None


class InternalSecretPermission(BasePermission):
    def has_permission(self, request: Request, view) -> bool:  # type: ignore[override]
        expected = getattr(settings, "TRIGGER_INTERNAL_SECRET", "")
        provided = request.META.get("HTTP_X_TRIGGER_INTERNAL_SECRET", "")
        return bool(expected and provided and provided == expected)


class SimulationHealthView(APIView):
    def get(self, request: Request) -> Response:
        return Response(
            success_response(
                {
                    "enabled": getattr(settings, "SIMULATION_MODE_ENABLED", True),
                    "max_responses": getattr(settings, "SIMULATION_MAX_RESPONSES", 10000),
                    "max_ai_jobs": getattr(settings, "SIMULATION_MAX_AI_JOBS", 25),
                    "max_runtime_minutes": getattr(settings, "SIMULATION_MAX_RUNTIME_MINUTES", 60),
                    "max_concurrent_runs": getattr(settings, "SIMULATION_MAX_CONCURRENT_RUNS", 2),
                    "allow_external_api": getattr(settings, "SIMULATION_ALLOW_EXTERNAL_API", False),
                    "queue": getattr(settings, "SIMULATION_AI_QUEUE_NAME", "simulation-ai-queue"),
                }
            ),
            status=status.HTTP_200_OK,
        )


class SimulationRunListCreateView(APIView):
    def get(self, request: Request) -> Response:
        runs = SimulationRun.objects.filter(owner=request.user, is_simulated=True).order_by("-created_at")
        try:
            limit = max(int(request.query_params.get("limit", 20)), 1)
            offset = max(int(request.query_params.get("offset", 0)), 0)
        except ValueError:
            return Response(
                error_response("limit and offset must be integers.", code="VALIDATION_ERROR"),
                status=status.HTTP_400_BAD_REQUEST,
            )
        total = runs.count()
        serializer = SimulationRunSerializer(runs[offset : offset + limit], many=True)
        return Response(
            success_response(
                {
                    "count": total,
                    "limit": limit,
                    "offset": offset,
                    "results": serializer.data,
                }
            ),
            status=status.HTTP_200_OK,
        )

    def post(self, request: Request) -> Response:
        serializer = SimulationRunCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                error_response(str(serializer.errors), code="VALIDATION_ERROR"),
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            run = SimulationManager.create_run(owner=request.user, payload=serializer.validated_data)
        except SimulationValidationError as exc:
            return Response(
                error_response(str(exc), code="VALIDATION_ERROR"),
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValueError as exc:
            return Response(
                error_response(str(exc), code="CONSTRAINT_VIOLATION"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            success_response(SimulationRunSerializer(run).data),
            status=status.HTTP_201_CREATED,
        )


class SimulationRunDetailView(APIView):
    def get(self, request: Request, pk: int) -> Response:
        run = get_object_or_404(
            SimulationRun.objects.filter(owner=request.user, is_simulated=True),
            pk=pk,
        )
        return Response(success_response(SimulationRunSerializer(run).data), status=status.HTTP_200_OK)


class InternalSimulationExecuteView(APIView):
    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request, pk: int) -> Response:
        run = get_object_or_404(SimulationRun, pk=pk, is_simulated=True)
        if run.status != SIMULATION_RUN_STATUS_PENDING:
            return Response(
                error_response("Only pending simulation runs can be executed.", code="INVALID_STATUS"),
                status=status.HTTP_409_CONFLICT,
            )
        try:
            executed_run = SimulationExecutor.execute(run)
        except SimulationGuardError as exc:
            run.mark_blocked(str(exc))
            return Response(
                error_response(str(exc), code="SAFEGUARD_BLOCKED"),
                status=status.HTTP_403_FORBIDDEN,
            )
        except Exception as exc:
            logger.exception("simulation execution failed")
            run.mark_failed(str(exc))
            return Response(
                error_response(str(exc), code="EXECUTION_ERROR"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            success_response(SimulationRunSerializer(executed_run).data),
            status=status.HTTP_200_OK,
        )


class SimulationUserExecuteView(APIView):
    """
    POST /simulation/runs/<pk>/execute/

    Triggers synchronous execution of a pending simulation run for the
    authenticated owner.  Calls SimulationExecutor (which calls Gemini) and
    returns the updated run once complete.
    """

    def post(self, request: Request, pk: int) -> Response:
        run = get_object_or_404(
            SimulationRun.objects.filter(owner=request.user, is_simulated=True),
            pk=pk,
        )
        if run.status != SIMULATION_RUN_STATUS_PENDING:
            return Response(
                error_response(
                    "Only pending simulation runs can be executed.",
                    code="INVALID_STATUS",
                ),
                status=status.HTTP_409_CONFLICT,
            )
        try:
            executed_run = SimulationExecutor.execute(run)
        except SimulationGuardError as exc:
            run.mark_blocked(str(exc))
            return Response(
                error_response(str(exc), code="SAFEGUARD_BLOCKED"),
                status=status.HTTP_403_FORBIDDEN,
            )
        except Exception as exc:
            logger.exception("simulation user-execute failed")
            run.mark_failed(str(exc))
            return Response(
                error_response(str(exc), code="EXECUTION_ERROR"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            success_response(SimulationRunSerializer(executed_run).data),
            status=status.HTTP_200_OK,
        )


class SimulationRunResultsView(APIView):
    """
    GET /simulation/runs/<pk>/results/

    Returns AI-generated synthetic responses from the SyntheticDataset
    associated with a completed simulation run.
    """

    def get(self, request: Request, pk: int) -> Response:
        run = get_object_or_404(
            SimulationRun.objects.filter(owner=request.user, is_simulated=True),
            pk=pk,
        )

        dataset = (
            run.synthetic_datasets.order_by("-created_at").first()
        )

        if not dataset:
            return Response(
                error_response(
                    "No dataset found for this simulation run. "
                    "Execute the run first.",
                    code="NO_DATASET",
                ),
                status=status.HTTP_404_NOT_FOUND,
            )

        responses = dataset.metadata.get("responses", [])
        return Response(
            success_response(
                {
                    "run_id": run.pk,
                    "run_status": run.status,
                    "dataset_id": dataset.pk,
                    "generated_records": dataset.metadata.get("generated_records", 0),
                    "persona_count": dataset.metadata.get("persona_count", 0),
                    "responses": responses,
                }
            ),
            status=status.HTTP_200_OK,
        )


class InternalSimulationCleanupView(APIView):
    authentication_classes = [NoAuthentication]
    permission_classes = [InternalSecretPermission]

    def post(self, request: Request, pk: int) -> Response:
        run = get_object_or_404(SimulationRun, pk=pk, is_simulated=True)
        cleaned_run = SimulationManager.cleanup_run(simulation_run=run)
        return Response(
            success_response(SimulationRunSerializer(cleaned_run).data),
            status=status.HTTP_200_OK,
        )
