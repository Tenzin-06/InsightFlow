from rest_framework.permissions import BasePermission
from rest_framework.request import Request


class IsSimulationUser(BasePermission):
    def has_permission(self, request: Request, view) -> bool:  # type: ignore[override]
        return bool(request.user and request.user.is_authenticated)


class IsSimulationOwner(BasePermission):
    def has_object_permission(self, request: Request, view, obj) -> bool:  # type: ignore[override]
        return bool(getattr(obj, "owner_id", None) == getattr(request.user, "id", None))


class IsSimulationAdmin(BasePermission):
    def has_permission(self, request: Request, view) -> bool:  # type: ignore[override]
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "is_superuser", False)
        )

