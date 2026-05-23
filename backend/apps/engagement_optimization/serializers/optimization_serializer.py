from rest_framework import serializers

from apps.engagement_optimization.constants import TRIGGER_TYPE_CHOICES
from apps.engagement_optimization.models import (
    EngagementSegment,
    FollowupExecution,
    OptimizationEvent,
    OptimizationRule,
)
from apps.engagement_optimization.validators import (
    validate_delay_days,
    validate_reminder_limit,
    validate_trigger_type,
)


class OptimizationRuleSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = OptimizationRule
        fields = [
            "id",
            "owner",
            "campaign",
            "rule_name",
            "trigger_type",
            "delay_days",
            "reminder_limit",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_rule_name(self, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise serializers.ValidationError("rule_name must not be blank.")
        if len(stripped) > 120:
            raise serializers.ValidationError("rule_name must not exceed 120 characters.")
        return stripped

    def validate_trigger_type(self, value: str) -> str:
        return validate_trigger_type(value)

    def validate_delay_days(self, value: int) -> int:
        return validate_delay_days(value)

    def validate_reminder_limit(self, value: int) -> int:
        return validate_reminder_limit(value)

    def validate(self, attrs):
        # Campaign ownership guard
        campaign = attrs.get("campaign")
        request = self.context.get("request")
        if campaign and request and campaign.owner_id != request.user.id:
            raise serializers.ValidationError(
                {"campaign": "You do not own this campaign."}
            )
        return attrs


class OptimizationEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptimizationEvent
        fields = [
            "id",
            "campaign",
            "optimization_rule",
            "recipient_email",
            "event_type",
            "triggered_at",
            "outcome",
            "metadata",
        ]
        read_only_fields = fields


class EngagementSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngagementSegment
        fields = [
            "id",
            "campaign",
            "recipient_email",
            "segment_type",
            "previous_segment",
            "assigned_at",
        ]
        read_only_fields = fields


class FollowupExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowupExecution
        fields = [
            "id",
            "campaign",
            "optimization_rule",
            "recipient_email",
            "status",
            "executed_at",
            "error_message",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class OptimizationRunSerializer(serializers.Serializer):
    campaign_id = serializers.IntegerField(help_text="Campaign to run optimization against.")
