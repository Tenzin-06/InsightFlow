from rest_framework import serializers
from apps.responses.models.answer import Answer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "question", "value", "metadata"]
