from rest_framework.permissions import BasePermission


class IsClerkAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request, "clerk_user") and request.clerk_user is not None
