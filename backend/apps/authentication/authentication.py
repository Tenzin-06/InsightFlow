import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class JWTAuthentication(BaseAuthentication):
    """
    Reads Authorization: Bearer <token>, validates it with Django's SECRET_KEY,
    and returns the AppUser. No external service required.
    """

    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith("Bearer "):
            return None  # Let other authenticators or AllowAny views proceed

        token = auth_header.split(" ", 1)[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token.")

        if payload.get("type") != "access":
            raise AuthenticationFailed("Invalid token type.")

        from apps.authentication.models import AppUser

        try:
            user = AppUser.objects.get(id=payload["user_id"])
        except AppUser.DoesNotExist:
            raise AuthenticationFailed("User not found.")

        if not user.is_active:
            raise AuthenticationFailed("User account is disabled.")

        return (user, token)

    def authenticate_header(self, request):
        return "Bearer"
