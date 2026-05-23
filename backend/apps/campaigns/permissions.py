from rest_framework.permissions import BasePermission


class IsCampaignOwner(BasePermission):
    """Allow access only to the campaign's owner."""

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsAudienceOwner(BasePermission):
    """Allow access only to the audience's owner."""

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
