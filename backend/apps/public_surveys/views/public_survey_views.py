from rest_framework.views import APIView
from rest_framework import status

from apps.surveys.models.survey import Survey, SURVEY_STATUS_PUBLISHED
from apps.responses.serializers.submission_serializer import SubmissionSerializer
from apps.responses.services.submission_service import submit_survey_response
from apps.responses.exceptions import SubmissionValidationError
from apps.public_surveys.permissions import PublicSurveyPermission
from apps.public_surveys.serializers.public_survey_serializer import PublicSurveySerializer
from apps.public_surveys.utils import success_response, error_response


class PublicSurveyDetailView(APIView):
    """
    GET /api/v1/public/surveys/<pk>/

    Returns a published survey with its ordered questions.
    No authentication required — accessible to any respondent.

    Availability rules:
    - Only surveys with status=published are returned.
    - Draft, archived, or deleted surveys return 404.

    Response:
        {"success": true, "data": {"id": ..., "title": ..., "questions": [...]}}
    """

    permission_classes = [PublicSurveyPermission]

    def get(self, request, pk):
        try:
            survey = (
                Survey.objects
                .prefetch_related("questions")
                .get(pk=pk, status=SURVEY_STATUS_PUBLISHED)
            )
        except Survey.DoesNotExist:
            return error_response(
                "This survey is unavailable.",
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PublicSurveySerializer(survey)
        return success_response(serializer.data)


class PublicSurveySubmitView(APIView):
    """
    POST /api/v1/public/surveys/<pk>/submit/

    Accepts survey response submissions from anonymous and authenticated respondents.

    - Anonymous: no Authorization header needed.
    - Authenticated: if a valid Bearer token is present, the respondent FK is set
      on the created Response record.

    Submission workflow:
      Resolve survey (published check)
      → Validate payload (SubmissionSerializer)
      → Validate answers (validation_service)
      → Normalize answers (normalization_service)
      → Persist Response + Answers atomically (transaction)
      → Return {"success": true, "data": {"response_id": <int>}}

    Rollback:
      Any validation failure or DB error rolls back the entire transaction.
      No partial responses are persisted.

    Error response:
        {"success": false, "error": {"message": "<reason>"}}
    """

    permission_classes = [PublicSurveyPermission]

    def post(self, request, pk):
        # --- Resolve survey (must exist and be published) ---
        try:
            survey = Survey.objects.get(pk=pk, status=SURVEY_STATUS_PUBLISHED)
        except Survey.DoesNotExist:
            return error_response(
                "Survey not found or not available for submission.",
                status=status.HTTP_404_NOT_FOUND,
            )

        # --- Validate incoming payload structure ---
        serializer = SubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))
            message = (
                first_error[0]
                if isinstance(first_error, list)
                else str(first_error)
            )
            return error_response(message, status=status.HTTP_400_BAD_REQUEST)

        validated = serializer.validated_data
        answers_data = validated["answers"]
        metadata = validated.get("metadata", {})

        # --- Resolve optional respondent ---
        # JWTAuthentication populates request.user when a valid Bearer token is
        # provided. For anonymous requests it returns AnonymousUser (is_authenticated=False).
        user = request.user
        respondent = user if getattr(user, "is_authenticated", False) else None

        # --- Orchestrate submission via shared service (atomic transaction) ---
        try:
            response = submit_survey_response(
                survey=survey,
                answers_data=answers_data,
                respondent=respondent,
                metadata=metadata,
            )
        except SubmissionValidationError as exc:
            return error_response(
                exc.message,
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        return success_response(
            {"response_id": response.id},
            status=status.HTTP_201_CREATED,
        )
