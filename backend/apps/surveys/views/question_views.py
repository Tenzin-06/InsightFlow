from rest_framework import viewsets, status
from rest_framework.response import Response
from apps.authentication.permissions import IsClerkAuthenticated
from apps.surveys.models.question import Question
from apps.surveys.models.survey import Survey
from apps.surveys.serializers.question_serializer import QuestionSerializer
from apps.surveys.permissions import IsSurveyOwner


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [IsClerkAuthenticated, IsSurveyOwner]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        qs = Question.objects.filter(survey__owner=self.request.user).select_related("survey")
        survey_pk = self.kwargs.get("survey_pk")
        if survey_pk:
            qs = qs.filter(survey__pk=survey_pk)
        return qs

    def get_permissions(self):
        if self.action in ("list", "create"):
            return [IsClerkAuthenticated()]
        return [IsClerkAuthenticated(), IsSurveyOwner()]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"success": True, "data": serializer.data, "error": None})

    def create(self, request, *args, **kwargs):
        survey_id = self.kwargs.get("survey_pk")
        try:
            survey = Survey.objects.get(pk=survey_id, owner=request.user)
        except Survey.DoesNotExist:
            return Response(
                {"success": False, "data": None, "error": {"message": "Survey not found."}},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(survey=survey)
        return Response(
            {"success": True, "data": serializer.data, "error": None},
            status=status.HTTP_201_CREATED,
        )

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "data": serializer.data, "error": None})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"success": True, "data": None, "error": None}, status=status.HTTP_204_NO_CONTENT)
