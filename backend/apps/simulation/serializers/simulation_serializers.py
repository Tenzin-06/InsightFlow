from rest_framework import serializers

from apps.simulation.models import (
    SimulationConfig,
    SimulationEvent,
    SimulationRun,
    SyntheticDataset,
)


class SimulationConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationConfig
        fields = [
            "id",
            "survey",
            "config_name",
            "is_enabled",
            "max_responses",
            "max_ai_jobs",
            "max_runtime_minutes",
            "max_concurrent_runs",
            "allow_external_api",
            "is_simulated",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_simulated", "created_at", "updated_at"]


class SyntheticDatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyntheticDataset
        fields = [
            "id",
            "simulation_run",
            "dataset_name",
            "dataset_type",
            "generated_by",
            "is_simulated",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_simulated", "created_at", "updated_at"]


class SimulationEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulationEvent
        fields = [
            "id",
            "simulation_run",
            "actor",
            "action_type",
            "status",
            "message",
            "metadata",
            "is_simulated",
            "timestamp",
        ]
        read_only_fields = ["id", "actor", "is_simulated", "timestamp"]


class SimulationRunSerializer(serializers.ModelSerializer):
    synthetic_datasets = SyntheticDatasetSerializer(many=True, read_only=True)
    events = SimulationEventSerializer(many=True, read_only=True)

    class Meta:
        model = SimulationRun
        fields = [
            "id",
            "survey",
            "config",
            "run_name",
            "status",
            "requested_responses",
            "ai_job_limit",
            "runtime_limit_minutes",
            "allow_external_api",
            "is_simulated",
            "metadata",
            "error_message",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
            "synthetic_datasets",
            "events",
        ]
        read_only_fields = [
            "id",
            "status",
            "is_simulated",
            "error_message",
            "started_at",
            "completed_at",
            "created_at",
            "updated_at",
            "synthetic_datasets",
            "events",
        ]


class SimulationRunCreateSerializer(serializers.Serializer):
    survey_id = serializers.IntegerField(min_value=1)
    run_name = serializers.CharField(max_length=255)
    requested_responses = serializers.IntegerField(min_value=0, default=0)
    ai_job_limit = serializers.IntegerField(min_value=0, default=0)
    runtime_limit_minutes = serializers.IntegerField(min_value=1, default=60)
    allow_external_api = serializers.BooleanField(default=False)
    metadata = serializers.DictField(required=False, default=dict)

