from rest_framework import serializers


class SendCampaignSerializer(serializers.Serializer):
    """Validate the POST /campaigns/:id/send/ request body (currently no required fields)."""
    pass


class TestEmailSerializer(serializers.Serializer):
    """Validate the POST /campaigns/:id/test/ request body."""
    email = serializers.EmailField(
        help_text="Destination address for the test email."
    )
