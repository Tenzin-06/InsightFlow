from rest_framework import serializers
from apps.campaigns.models.audience import Audience
from apps.campaigns.serializers.recipient_serializer import RecipientSerializer


class AudienceSerializer(serializers.ModelSerializer):
    recipient_count = serializers.SerializerMethodField()
    recipients = RecipientSerializer(many=True, read_only=True)

    class Meta:
        model = Audience
        fields = [
            "id",
            "name",
            "description",
            "owner",
            "metadata",
            "recipient_count",
            "recipients",
            "created_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "recipients"]

    def get_recipient_count(self, obj):
        # Use cached queryset if prefetched, otherwise count directly.
        if hasattr(obj, "_prefetched_objects_cache") and "recipients" in obj._prefetched_objects_cache:
            return len(obj._prefetched_objects_cache["recipients"])
        return obj.recipients.count()

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value.strip()

    def validate(self, data):
        request = self.context.get("request")
        if request:
            name = data.get("name", getattr(self.instance, "name", None))
            owner = request.user
            qs = Audience.objects.filter(name=name, owner=owner)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {"name": "You already have an audience with this name."}
                )
        return data
