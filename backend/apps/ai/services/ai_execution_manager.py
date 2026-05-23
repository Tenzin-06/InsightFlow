"""
AIExecutionManager — orchestrates the full lifecycle of an AI job.

Workflow:
    Task Created (pending)
    → mark_processing()
    → execute AI via gateway
    → mark_completed(result)  OR  mark_failed(error)

Also records AIExecution and AIUsageRecord rows for observability.
"""

import logging
from typing import Callable, Any, Optional

logger = logging.getLogger("apps.ai")


class AIExecutionManager:
    """
    Manages creation, execution, and lifecycle tracking of AIJob records.

    All methods are static so callers do not need to instantiate the class.
    """

    # ------------------------------------------------------------------
    # Job creation
    # ------------------------------------------------------------------

    @staticmethod
    def create_job(job_type: str, payload: dict) -> Any:
        """
        Create and persist a new AIJob with status=pending.

        Parameters
        ----------
        job_type : One of the AIJobType constants (e.g. "summarization").
        payload  : Arbitrary input data for this job.

        Returns the newly created AIJob instance.
        """
        from apps.ai.models.ai_job import AIJob
        from apps.ai.constants.ai_constants import AIJobStatus

        job = AIJob.objects.create(
            job_type=job_type,
            status=AIJobStatus.PENDING,
            payload=payload,
        )
        logger.info("AIJob created | id=%d type=%s", job.pk, job_type)
        return job

    # ------------------------------------------------------------------
    # Job execution
    # ------------------------------------------------------------------

    @staticmethod
    def execute_job(
        job: Any,
        gateway_fn: Callable[..., dict],
        **kwargs: Any,
    ) -> dict:
        """
        Execute an AI job end-to-end.

        Steps
        -----
        1. Transition job to processing.
        2. Create an AIExecution record for this attempt.
        3. Call *gateway_fn(**kwargs)* — the AI operation.
        4. Write an AIUsageRecord.
        5. Transition job to completed or failed.

        Parameters
        ----------
        job        : An AIJob instance (already persisted).
        gateway_fn : A callable from AIGateway (e.g. gateway.run_summarization).
        **kwargs   : Arguments forwarded to gateway_fn.

        Returns the result dict from the gateway on success.
        Raises the original exception on failure after recording the failure.
        """
        from django.utils import timezone
        from apps.ai.models.ai_execution import AIExecution
        from apps.ai.models.ai_usage_record import AIUsageRecord

        job.mark_processing()
        started_at = timezone.now()

        execution = AIExecution.objects.create(
            job=job,
            model_name="gemini",
            attempt_number=1,
            started_at=started_at,
        )

        try:
            result: dict = gateway_fn(**kwargs)
            completed_at = timezone.now()

            # Record execution details
            execution.success = True
            execution.completed_at = completed_at
            execution.raw_response = str(result.get("text", ""))[:2000]
            execution.save(
                update_fields=["success", "completed_at", "raw_response"]
            )

            # Record usage
            AIUsageRecord.objects.create(
                job=job,
                model_name=result.get("model", "gemini"),
                tokens_used=result.get("tokens_used", 0),
                request_type=job.job_type,
                execution_time=(completed_at - started_at).total_seconds(),
            )

            job.mark_completed(
                {
                    "output": result.get("text", ""),
                    "tokens_used": result.get("tokens_used", 0),
                    "latency_ms": result.get("latency_ms", 0.0),
                }
            )
            logger.info("AIJob completed | id=%d type=%s", job.pk, job.job_type)
            return result

        except Exception as exc:
            completed_at = timezone.now()

            execution.success = False
            execution.completed_at = completed_at
            execution.error_message = str(exc)[:1000]
            execution.save(
                update_fields=["success", "completed_at", "error_message"]
            )

            job.mark_failed(str(exc))
            logger.error(
                "AIJob failed | id=%d type=%s error=%s",
                job.pk,
                job.job_type,
                exc,
            )
            raise

    # ------------------------------------------------------------------
    # Status retrieval
    # ------------------------------------------------------------------

    @staticmethod
    def get_job_status(job_id: int) -> Optional[dict]:
        """
        Return a status summary dict for *job_id*, or None if not found.
        """
        from apps.ai.models.ai_job import AIJob

        try:
            job = AIJob.objects.get(pk=job_id)
        except AIJob.DoesNotExist:
            return None

        return {
            "id": job.pk,
            "job_type": job.job_type,
            "status": job.status,
            "result": job.result,
            "error_message": job.error_message or None,
            "created_at": job.created_at.isoformat(),
            "updated_at": job.updated_at.isoformat(),
        }
