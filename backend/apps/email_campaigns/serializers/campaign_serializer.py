from rest_framework import serializers
from apps.campaigns.models.campaign import Campaign
from apps.campaigns.constants import TEMPLATE_CHOICES


class EmailCampaignSerializer(serializers.ModelSerializer):
    """
    Serializer for campaign fields introduced by the email distribution system.
    Used when patching subject / template_name from the send workflow.
    """

    template_name = serializers.ChoiceField(choices=TEMPLATE_CHOICES, required=False)

    class Meta:
        model = Campaign
        fields = ["id", "title", "subject", "template_name", "status", "updated_at"]
        read_only_fields = ["id", "status", "updated_at"]
