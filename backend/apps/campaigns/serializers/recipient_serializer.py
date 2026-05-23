from rest_framework import serializers
from apps.campaigns.models.recipient import Recipient


class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = [
            "id",
            "audience",
            "email",
            "first_name",
            "last_name",
            "metadata",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_email(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Email cannot be empty.")
        return value.strip().lower()
