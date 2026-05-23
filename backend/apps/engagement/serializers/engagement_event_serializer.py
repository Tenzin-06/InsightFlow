from rest_framework import serializers

from apps.engagement.constants import TRACKABLE_PUBLIC_EVENTS


class EngagementEventCreateSerializer(serializers.Serializer):
    event_type = serializers.ChoiceField(choices=sorted(TRACKABLE_PUBLIC_EVENTS))
    survey_id = serializers.IntegerField(min_value=1)
    session_id = serializers.UUIDField(required=False)
    tracking_token = serializers.UUIDField(required=False)
    question_id = serializers.IntegerField(min_value=1, required=False)
    answered_questions_count = serializers.IntegerField(min_value=0, required=False)
    total_questions_count = serializers.IntegerField(min_value=0, required=False)
    metadata = serializers.DictField(required=False)

