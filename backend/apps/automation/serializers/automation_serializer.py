from django.utils import timezone
from rest_framework import serializers

from apps.automation.constants import REMINDER_DELAY_CHOICES
from apps.automation.models import AutomationEvent, AutomationSchedule, ReminderRule

VALID_REMINDER_DELAYS = {choice[0] for choice in REMINDER_DELAY_CHOICES}


class ReminderRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReminderRule
        fields = [
            "id",
            "delay_days",
            "reminder_type",
            "max_reminders",
            "is_enabled",
            "recipient_email",
            "reminder_count",
            "last_reminder_at",
            "responded_after_reminder",
        ]
        read_only_fields = [
            "id",
            "recipient_email",
            "reminder_count",
            "last_reminder_at",
            "responded_after_reminder",
        ]


class AutomationEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutomationEvent
        fields = [
            "id",
            "event_type",
            "recipient_email",
            "message",
            "metadata",
            "created_at",
        ]
        read_only_fields = fields


class AutomationScheduleSerializer(serializers.ModelSerializer):
    reminder_rules = serializers.SerializerMethodField()
    events = AutomationEventSerializer(many=True, read_only=True)

    class Meta:
        model = AutomationSchedule
        fields = [
            "id",
            "campaign",
            "automation_type",
            "status",
            "scheduled_for",
            "executed_at",
            "cancelled_at",
            "trigger_job_id",
            "result",
            "error_message",
            "metadata",
            "reminder_rules",
            "events",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

    def get_reminder_rules(self, obj):
        rules = obj.campaign.reminder_rules.filter(recipient_email="")
        return ReminderRuleSerializer(rules, many=True).data


class CampaignScheduleSerializer(serializers.Serializer):
    scheduled_for = serializers.DateTimeField()
    reminder_delays = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        allow_empty=True,
        default=list,
    )
    max_reminders = serializers.IntegerField(required=False, min_value=1, max_value=3, default=1)

    def validate_scheduled_for(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("scheduled_for must be a future UTC datetime.")
        return value

    def validate_reminder_delays(self, value):
        invalid = sorted(set(value) - VALID_REMINDER_DELAYS)
        if invalid:
            allowed = ", ".join(str(delay) for delay in sorted(VALID_REMINDER_DELAYS))
            raise serializers.ValidationError(f"Reminder delays must be one of: {allowed}.")
        return sorted(set(value))

