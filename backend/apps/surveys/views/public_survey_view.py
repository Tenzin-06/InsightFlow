from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from apps.surveys.models.survey import Survey, SURVEY_STATUS_PUBLISHED
from apps.surveys.serializers.question_serializer import QuestionSerializer


class PublicSurveyView(APIView):
    """
    GET /api/v1/surveys/<pk>/public/

    Returns a published survey with its questions to unauthenticated respondents.
    Only surveys with status=published are accessible via this endpoint.
    """

    permission_classes = [AllowAny]

    def get(self, request, pk, *args, **kwargs):
        try:
            survey = (
                Survey.objects
                .filter(pk=pk, status=SURVEY_STATUS_PUBLISHED)
                .prefetch_related("questions")
                .get()
            )
        except Survey.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "data": None,
                    "error": {
                        "code": "SURVEY_NOT_FOUND",
                        "message": "This survey does not exist or is not available.",
                    },
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        questions = survey.questions.order_by("order")
        questions_data = QuestionSerializer(questions, many=True).data

        data = {
            "id": survey.id,
            "title": survey.title,
            "description": survey.description,
            "question_count": questions.count(),
            "questions": questions_data,
        }

        return Response({"success": True, "data": data, "error": None})
