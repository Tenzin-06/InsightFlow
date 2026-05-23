from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from apps.surveys.models.survey import Survey, SURVEY_STATUS_PUBLISHED
from apps.responses.serializers.submission_serializer import SubmissionSerializer
from apps.responses.services.submission_service import submit_survey_response
from apps.responses.exceptions import SubmissionValidationError
from apps.responses.utils import success_response, error_response


class SurveySubmitView(APIView):
    """
    POST /api/v1/surveys/<survey_pk>/submit/

    Accepts anonymous and authenticated survey submissions.
    - Anonymous: no Authorization header required.
    - Authenticated: if a valid token is present, the respondent is linked.

    Success response:
        {"success": true, "data": {"response_id": <int>}}

    Error response:
        {"success": false, "error": {"message": "<reason>"}}
    """

    # Override global IsClerkAuthenticated — submissions are open to anonymous users
    permission_classes = [AllowAny]

    def post(self, request, survey_pk):
        # --- Resolve survey (must exist and be published) ---
        try:
            survey = Survey.objects.get(pk=survey_pk, status=SURVEY_STATUS_PUBLISHED)
        except Survey.DoesNotExist:
            return error_response(
                "Survey not found or not available for submission.",
                status=status.HTTP_404_NOT_FOUND,
            )

        # --- Validate incoming payload ---
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
        # JWTAuthentication sets request.user to the AppUser when a valid token is
        # provided. For unauthenticated (anonymous) requests it returns None /
        # Django AnonymousUser, so we guard with is_authenticated.
        user = request.user
        respondent = user if getattr(user, "is_authenticated", False) else None

        # --- Orchestrate submission ---
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
