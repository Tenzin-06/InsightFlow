from rest_framework.permissions import BasePermission


class IsAuthenticated(BasePermission):
    """
    Allows access only to authenticated (active) users resolved by JWTAuthentication.
    Drop-in replacement for the old IsClerkAuthenticated.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and not request.user.is_anonymous
            and request.user.is_authenticated
        )
