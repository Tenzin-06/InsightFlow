from rest_framework import serializers

from apps.surveys.models.survey import Survey
from apps.surveys.models.question import Question


class PublicQuestionSerializer(serializers.ModelSerializer):
    """
    Exposes the minimal question fields needed for public survey rendering.

    Includes metadata (choices for multiple_choice/checkbox, range for rating)
    so the frontend renderer can build each question type correctly.
    """

    class Meta:
        model = Question
        fields = [
            "id",
            "question_text",
            "question_type",
            "is_required",
            "order",
            "metadata",
        ]


class PublicSurveySerializer(serializers.ModelSerializer):
    """
    Exposes a published survey for public respondents.

    Includes nested questions (ordered by `order`) and a convenience
    `question_count` so the frontend can display progress without
    computing len(questions) itself.

    Fields intentionally excluded for public exposure:
    - owner
    - status
    - is_public
    - created_at / updated_at
    """

    questions = PublicQuestionSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Survey
        fields = [
            "id",
            "title",
            "description",
            "question_count",
            "questions",
        ]

    def get_question_count(self, obj) -> int:
        # questions are ordered by `order` at the model level (Meta.ordering)
        return obj.questions.count()
