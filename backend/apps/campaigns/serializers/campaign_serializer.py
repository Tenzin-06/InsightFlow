from rest_framework import serializers
from apps.campaigns.models.campaign import Campaign
from apps.campaigns.models.audience import Audience
from apps.campaigns.constants import CAMPAIGN_STATUS_CHOICES, VALID_TRANSITIONS

VALID_STATUS_VALUES = {s[0] for s in CAMPAIGN_STATUS_CHOICES}

TEMPLATE_KEY_MAP = {
    # Frontend templateKey → backend template_name
    "minimal_invite": "survey_invitation",
    "academic_survey": "survey_invitation",
    "reminder_placeholder": "reminder_email",
    "survey_invitation": "survey_invitation",
    "reminder_email": "reminder_email",
    "test_email": "test_email",
}


class CampaignSerializer(serializers.ModelSerializer):
    """
    Full campaign serializer — supports read and write including audiences M2M.
    """
    audiences = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Audience.objects.all(),
        required=False,
    )
    # Use CharField so frontend keys (e.g. "minimal_invite") pass validation;
    # mapping to backend choices happens in validate_template_name.
    template_name = serializers.CharField(required=False, default="survey_invitation")
    response_count = serializers.SerializerMethodField(read_only=True)

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
            "response_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "response_count", "created_at", "updated_at"]

    def get_response_count(self, obj):
        try:
            return obj.survey.responses.count() if obj.survey_id else 0
        except Exception:
            return 0

    def validate_template_name(self, value):
        """Map frontend template keys to backend choices. Unknown keys default to survey_invitation."""
        return TEMPLATE_KEY_MAP.get(value, "survey_invitation")

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

    def create(self, validated_data):
        audiences = validated_data.pop("audiences", [])
        campaign = Campaign.objects.create(**validated_data)
        if audiences:
            campaign.audiences.set(audiences)
        return campaign

    def update(self, instance, validated_data):
        audiences = validated_data.pop("audiences", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if audiences is not None:
            instance.audiences.set(audiences)
        return instance
