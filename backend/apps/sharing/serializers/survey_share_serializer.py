from rest_framework import serializers
from apps.surveys.models.survey import Survey


class SurveyShareSerializer(serializers.ModelSerializer):
    """Read-only serializer exposing public share metadata."""

    class Meta:
        model = Survey
        fields = [
            "title",
            "slug",
            "description",
            "status",
            "is_public",
        ]
        read_only_fields = fields
