from rest_framework import serializers
from apps.email_campaigns.models.delivery_log import DeliveryLog


class DeliveryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryLog
        fields = [
            "id",
            "campaign",
            "recipient_email",
            "recipient_first_name",
            "status",
            "provider_message_id",
            "sent_at",
            "error_message",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
