from rest_framework.permissions import BasePermission


class IsCampaignOwner(BasePermission):
    """
    Allow access only to the owner of the campaign.
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
