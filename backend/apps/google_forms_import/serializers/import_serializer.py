from rest_framework import serializers

from apps.google_forms_import.utils.url_utils import is_valid_google_forms_url


class GoogleFormsImportSerializer(serializers.Serializer):
    url = serializers.URLField(max_length=2048)

    def validate_url(self, value: str) -> str:
        normalized = value.strip()
        if not is_valid_google_forms_url(normalized):
            raise serializers.ValidationError(
                "Invalid Google Forms URL. Must be a publicly accessible URL from https://docs.google.com/forms/."
            )
        return normalized
