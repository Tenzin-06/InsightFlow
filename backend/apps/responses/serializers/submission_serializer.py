from rest_framework import serializers
from apps.responses.constants import MAX_ANSWERS_PER_SUBMISSION


class AnswerInputSerializer(serializers.Serializer):
    question_id = serializers.IntegerField(min_value=1)
    value = serializers.JSONField()


class SubmissionSerializer(serializers.Serializer):
    answers = AnswerInputSerializer(many=True)
    metadata = serializers.JSONField(required=False, default=dict)

    def validate_answers(self, value):
        if not value:
            raise serializers.ValidationError("At least one answer is required.")
        if len(value) > MAX_ANSWERS_PER_SUBMISSION:
            raise serializers.ValidationError(
                f"Submission exceeds maximum of {MAX_ANSWERS_PER_SUBMISSION} answers."
            )
        # Reject duplicate question_id entries in a single submission
        question_ids = [a["question_id"] for a in value]
        if len(question_ids) != len(set(question_ids)):
            raise serializers.ValidationError(
                "Duplicate question_id entries are not allowed in a single submission."
            )
        return value
