from rest_framework.permissions import AllowAny


class PublicSurveyPermission(AllowAny):
    """
    Open permission for public survey participation.

    All public survey endpoints (/api/v1/public/surveys/*) are accessible
    without authentication. Authenticated requests are still permitted —
    the respondent will be linked to the submission if a valid token is present.

    Future extensions:
    - IP-based rate limiting
    - CAPTCHA verification
    - Invitation-only access control
    """
    pass
