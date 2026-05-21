from rest_framework import serializers
from apps.surveys.models.question import Question, QUESTION_TYPES


VALID_QUESTION_TYPES = {t[0] for t in QUESTION_TYPES}


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "survey", "question_text", "question_type", "is_required", "order", "metadata"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "survey": {"read_only": True},
        }

    def validate_question_type(self, value):
        if value not in VALID_QUESTION_TYPES:
            raise serializers.ValidationError(
                f"Invalid question type. Must be one of: {', '.join(VALID_QUESTION_TYPES)}"
            )
        return value

    def validate_question_text(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Question text cannot be empty.")
        return value.strip()

    def validate_order(self, value):
        if value < 0:
            raise serializers.ValidationError("Order must be a non-negative integer.")
        return value
