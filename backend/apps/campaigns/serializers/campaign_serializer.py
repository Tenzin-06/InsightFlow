from rest_framework import serializers
from apps.campaigns.models.campaign import Campaign
from apps.campaigns.constants import CAMPAIGN_STATUS_CHOICES, VALID_TRANSITIONS

VALID_STATUS_VALUES = {s[0] for s in CAMPAIGN_STATUS_CHOICES}


class CampaignSerializer(serializers.ModelSerializer):
    audiences = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Campaign
        fields = [
            "id",
            "title",
            "description",
            "subject",
            "template_name",
            "survey",
            "status",
            "audiences",
            "metadata",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        if len(value.strip()) > 255:
            raise serializers.ValidationError("Title cannot exceed 255 characters.")
        return value.strip()

    def validate_status(self, value):
        if value not in VALID_STATUS_VALUES:
            raise serializers.ValidationError(
                f"Invalid status. Must be one of: {', '.join(sorted(VALID_STATUS_VALUES))}"
            )
        if self.instance:
            current = self.instance.status
            allowed = VALID_TRANSITIONS.get(current, set())
            if value != current and value not in allowed:
                raise serializers.ValidationError(
                    f"Cannot transition from '{current}' to '{value}'."
                )
        return value

    def validate_survey(self, value):
        request = self.context.get("request")
        if request and value.owner != request.user:
            raise serializers.ValidationError("You do not own this survey.")
        return value
