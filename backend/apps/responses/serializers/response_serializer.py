from rest_framework import serializers
from apps.responses.models.response import Response
from .answer_serializer import AnswerSerializer


class ResponseSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Response
        fields = ["id", "survey", "respondent", "metadata", "submitted_at", "answers"]
