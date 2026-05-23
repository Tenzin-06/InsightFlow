from rest_framework.permissions import BasePermission


class IsResponseOwner(BasePermission):
    """
    Allow access only when the requesting user owns the survey
    that the response belongs to.
    Used for future admin/analytics endpoints (GET, DELETE on responses).
    """

    def has_object_permission(self, request, view, obj):
        # obj is a Response instance
        return obj.survey.owner == request.user
