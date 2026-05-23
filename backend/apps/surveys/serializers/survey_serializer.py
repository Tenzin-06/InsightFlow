from rest_framework import serializers
from apps.surveys.models.survey import Survey, SURVEY_STATUS_CHOICES
from apps.surveys.serializers.question_serializer import QuestionSerializer


VALID_STATUSES = {s[0] for s in SURVEY_STATUS_CHOICES}


class SurveySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Survey
        fields = [
            "id",
            "owner",
            "title",
            "description",
            "status",
            "slug",
            "is_public",
            "created_at",
            "updated_at",
            "questions",
        ]
        read_only_fields = ["id", "owner", "slug", "created_at", "updated_at"]

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        if len(value.strip()) > 255:
            raise serializers.ValidationError("Title cannot exceed 255 characters.")
        return value.strip()

    def validate_status(self, value):
        if value not in VALID_STATUSES:
            raise serializers.ValidationError(
                f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}"
            )
        return value
