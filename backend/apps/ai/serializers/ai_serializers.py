"""
DRF serializers for the AI app.

AIJobSerializer        — read-only job status representation
AIJobCreateSerializer  — validates a manual job creation request
AIUsageRecordSerializer — read-only usage tracking representation
"""

from rest_framework import serializers

from apps.ai.models.ai_job import AIJob
from apps.ai.models.ai_usage_record import AIUsageRecord
from apps.ai.constants.ai_constants import AIJobType


class AIJobSerializer(serializers.ModelSerializer):
    """Read-only serialiser for AI job status responses."""

    class Meta:
        model = AIJob
        fields = [
            "id",
            "job_type",
            "status",
            "result",
            "error_message",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class AIJobCreateSerializer(serializers.Serializer):
    """
    Validates a request to manually enqueue an AI job.

    Used by the public POST /api/v1/ai/jobs/ endpoint.
    """

    job_type = serializers.ChoiceField(
        choices=[choice[0] for choice in AIJobType.CHOICES]
    )
    payload = serializers.DictField(
        child=serializers.JSONField(),
        default=dict,
        allow_empty=True,
    )

    def validate_payload(self, value: dict) -> dict:
        if not isinstance(value, dict):
            raise serializers.ValidationError("Payload must be a JSON object.")
        return value


class AIUsageRecordSerializer(serializers.ModelSerializer):
    """Read-only serialiser for AI usage tracking records."""

    class Meta:
        model = AIUsageRecord
        fields = [
            "id",
            "model_name",
            "tokens_used",
            "request_type",
            "execution_time",
            "estimated_cost",
            "created_at",
        ]
        read_only_fields = fields
