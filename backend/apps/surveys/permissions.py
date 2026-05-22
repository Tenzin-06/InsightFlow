from rest_framework.permissions import BasePermission


class IsSurveyOwner(BasePermission):
    """Allow access only to the survey's owner."""

    def has_object_permission(self, request, view, obj):
        # obj is a Survey or Question instance
        survey = getattr(obj, "survey", obj)
        return survey.owner == request.user
