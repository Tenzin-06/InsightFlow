"""
AI app views.

Public endpoints (JWT-authenticated):
    GET  /api/v1/ai/jobs/{id}/   — retrieve AI job status
    POST /api/v1/ai/jobs/        — enqueue a new AI job (manual trigger)
    GET  /api/v1/ai/health/      — verify AI provider connectivity

Internal endpoints (Trigger.dev workers, internal secret auth):
    POST /api/v1/internal/ai/jobs/{id}/execute/ — execute a queued AI job
"""

import logging

from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai.constants.ai_constants import AIJobStatus, AIJobType
from apps.ai.models.ai_job import AIJob
from apps.ai.serializers.ai_serializers import AIJobCreateSerializer, AIJobSerializer
from apps.ai.services.ai_execution_manager import AIExecutionManager
from apps.ai.services.ai_gateway import AIGateway

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _success(data: object) -> dict:
    return {"success": True, "data": data, "error": None}


def _error(message: str, code: str = "AI_ERROR") -> dict:
    return {"success": False, "data": None, "error": {"code": code, "message": message}}


# ---------------------------------------------------------------------------
# Internal auth (shared with email_campaigns pattern)
# ---------------------------------------------------------------------------

class _NoAuthentication(BaseAuthentication):
    def authenticate(self, request: Request):  # type: ignore[override]
        return None


class _InternalSecretPermission(BasePermission):
    def has_permission(self, request: Request, view) -> bool:  # type: ignore[override]
        expected = getattr(settings, "TRIGGER_INTERNAL_SECRET", "")
        provided = request.META.get("HTTP_X_TRIGGER_INTERNAL_SECRET", "")
        if not expected:
            logger.warning("TRIGGER_INTERNAL_SECRET not configured — blocking internal AI request")
            return False
        return bool(provided and provided == expected)


# ---------------------------------------------------------------------------
# Public views
# ---------------------------------------------------------------------------

class AIHealthView(APIView):
    """
    GET /api/v1/ai/health/

    Returns AI provider configuration status.
    Does NOT make a live provider call — just checks that settings are present.
    """

    def get(self, request: Request) -> Response:
        api_key_configured = bool(getattr(settings, "GEMINI_API_KEY", ""))
        model = getattr(settings, "GEMINI_MODEL", "gemini-1.5-flash")
        max_retries = getattr(settings, "AI_MAX_RETRIES", 3)
        timeout = getattr(settings, "AI_TIMEOUT_SECONDS", 30)
        logging_enabled = getattr(settings, "AI_ENABLE_LOGGING", True)

        return Response(
            _success({
                "provider": "gemini",
                "model": model,
                "api_key_configured": api_key_configured,
                "max_retries": max_retries,
                "timeout_seconds": timeout,
                "logging_enabled": logging_enabled,
            }),
            status=status.HTTP_200_OK,
        )


class AIJobListCreateView(APIView):
    """
    POST /api/v1/ai/jobs/

    Manually enqueue an AI job. Returns the created job (status=pending).
    The actual execution is handled asynchronously by a Trigger.dev task.
    """

    def post(self, request: Request) -> Response:
        serializer = AIJobCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                _error(str(serializer.errors), code="VALIDATION_ERROR"),
                status=status.HTTP_400_BAD_REQUEST,
            )

        job = AIExecutionManager.create_job(
            job_type=serializer.validated_data["job_type"],
            payload=serializer.validated_data.get("payload", {}),
        )

        return Response(
            _success(AIJobSerializer(job).data),
            status=status.HTTP_201_CREATED,
        )


class AIJobDetailView(APIView):
    """
    GET /api/v1/ai/jobs/{id}/

    Retrieve the current status and result of an AI job.
    """

    def get(self, request: Request, pk: int) -> Response:
        status_data = AIExecutionManager.get_job_status(pk)
        if status_data is None:
            return Response(
                _error("AI job not found.", code="NOT_FOUND"),
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(_success(status_data), status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Internal view (called by Trigger.dev workers)
# ---------------------------------------------------------------------------

class InternalAIJobExecuteView(APIView):
    """
    POST /api/v1/internal/ai/jobs/{id}/execute/

    Called by Trigger.dev AI task workers to run a queued AI job.
    Delegates to the appropriate AIGateway operation based on job_type.

    Access: internal only (X-Trigger-Internal-Secret required)
    Authentication: none (bypasses JWT)
    """

    authentication_classes = [_NoAuthentication]
    permission_classes = [_InternalSecretPermission]

    def post(self, request: Request, pk: int) -> Response:
        job = get_object_or_404(AIJob, pk=pk)

        if job.status not in (AIJobStatus.PENDING,):
            return Response(
                _error(
                    f"Job {pk} is already in status '{job.status}' — cannot re-execute.",
                    code="INVALID_STATUS",
                ),
                status=status.HTTP_409_CONFLICT,
            )

        logger.info("Internal AI job execute requested — job_id=%d type=%s", pk, job.job_type)

        gateway = AIGateway()

        try:
            if job.job_type == AIJobType.SUMMARIZATION:
                text = job.payload.get("text", "")
                context = job.payload.get("context")
                result = AIExecutionManager.execute_job(
                    job,
                    gateway.run_summarization,
                    text=text,
                    context=context,
                    job_type=job.job_type,
                )

            elif job.job_type == AIJobType.CLASSIFICATION:
                text = job.payload.get("text", "")
                categories = job.payload.get("categories", [])
                result = AIExecutionManager.execute_job(
                    job,
                    gateway.run_classification,
                    text=text,
                    categories=categories,
                    job_type=job.job_type,
                )

            elif job.job_type == AIJobType.TEXT_ANALYSIS:
                prompt = job.payload.get("prompt", "")
                result = AIExecutionManager.execute_job(
                    job,
                    gateway.run_text_generation,
                    prompt=prompt,
                    job_type=job.job_type,
                )

            else:
                # Default: structured output
                prompt = job.payload.get("prompt", "")
                result = AIExecutionManager.execute_job(
                    job,
                    gateway.run_structured_output,
                    prompt=prompt,
                    job_type=job.job_type,
                )

        except Exception as exc:
            logger.error("AI job execution failed — job_id=%d error=%s", pk, exc)
            return Response(
                _error(str(exc), code="EXECUTION_ERROR"),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            _success({"job_id": pk, "output": result.get("text", ""), "tokens_used": result.get("tokens_used", 0)}),
            status=status.HTTP_200_OK,
        )
