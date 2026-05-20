from rest_framework import serializers


class SuccessResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField(default=True)
    data = serializers.JSONField(allow_null=True)
    error = serializers.JSONField(allow_null=True, default=None)
