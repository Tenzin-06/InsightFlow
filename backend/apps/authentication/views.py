import datetime

import jwt
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated as DRFIsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.authentication.models import AppUser
from apps.authentication.serializers import LoginSerializer, RegisterSerializer


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _generate_tokens(user: AppUser) -> dict:
    now = datetime.datetime.now(datetime.timezone.utc)
    access_payload = {
        "user_id": user.id,
        "email": user.email,
        "type": "access",
        "iat": now,
        "exp": now + datetime.timedelta(minutes=60),
    }
    refresh_payload = {
        "user_id": user.id,
        "type": "refresh",
        "iat": now,
        "exp": now + datetime.timedelta(days=7),
    }
    access = jwt.encode(access_payload, settings.SECRET_KEY, algorithm="HS256")
    refresh = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm="HS256")
    return {"access": access, "refresh": refresh}


def _user_data(user: AppUser) -> dict:
    return {"id": user.id, "email": user.email, "full_name": user.full_name}


# ---------------------------------------------------------------------------
# Register
# ---------------------------------------------------------------------------

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        full_name = serializer.validated_data.get("full_name", "")

        if AppUser.objects.filter(email=email).exists():
            return Response(
                {"success": False, "error": {"email": ["A user with this email already exists."]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = AppUser(email=email, full_name=full_name)
        user.set_password(password)
        user.save()

        tokens = _generate_tokens(user)
        return Response(
            {"success": True, "data": {"user": _user_data(user), **tokens}},
            status=status.HTTP_201_CREATED,
        )


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            user = AppUser.objects.get(email=email)
        except AppUser.DoesNotExist:
            return Response(
                {"success": False, "error": {"message": "Invalid email or password."}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.check_password(password):
            return Response(
                {"success": False, "error": {"message": "Invalid email or password."}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"success": False, "error": {"message": "This account is inactive."}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = _generate_tokens(user)
        return Response(
            {"success": True, "data": {"user": _user_data(user), **tokens}},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------------
# Token refresh
# ---------------------------------------------------------------------------

class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"success": False, "error": {"message": "Refresh token is required."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return Response(
                {"success": False, "error": {"message": "Refresh token has expired."}},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except jwt.InvalidTokenError:
            return Response(
                {"success": False, "error": {"message": "Invalid refresh token."}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if payload.get("type") != "refresh":
            return Response(
                {"success": False, "error": {"message": "Invalid token type."}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            user = AppUser.objects.get(id=payload["user_id"])
        except AppUser.DoesNotExist:
            return Response(
                {"success": False, "error": {"message": "User not found."}},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = _generate_tokens(user)
        return Response({"success": True, "data": tokens})


# ---------------------------------------------------------------------------
# Current user (me)
# ---------------------------------------------------------------------------

class MeView(APIView):
    permission_classes = [DRFIsAuthenticated]

    def get(self, request):
        # JWTAuthentication sets request.user to our AppUser
        user = request.user
        return Response({"success": True, "data": _user_data(user)})
