import logging
from rest_framework.permissions import BasePermission

logger = logging.getLogger(__name__)


class IsAnalyticsOwner(BasePermission):
    """
    Object-level permission: the authenticated user may only access analytics
    for resources (surveys, campaigns) that they own.

    Usage:
        permission_classes = [IsAuthenticated, IsAnalyticsOwner]

    The view must pass the relevant object (survey or campaign) to
    `self.check_object_permissions(request, obj)`.
    """

    message = "You do not have permission to view analytics for this resource."

    def has_permission(self, request, view):
        # User must be authenticated
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        """
        Accepts any model that has an `owner_id` or `owner` attribute.
        Surveys and campaigns both satisfy this contract.
        """
        owner_id = getattr(obj, "owner_id", None)

        if owner_id is None:
            # Fallback: try nested owner object
            owner = getattr(obj, "owner", None)
            owner_id = getattr(owner, "id", None) if owner else None

        if owner_id is None:
            logger.warning(
                "IsAnalyticsOwner: object %r has no owner_id — denying access.",
                obj,
            )
            return False

        return owner_id == request.user.id
