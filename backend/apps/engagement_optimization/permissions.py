from rest_framework.permissions import BasePermission


class IsCampaignOwner(BasePermission):
    """
    Allow access only if request.user owns the campaign referenced in
    the view's URL kwargs (``pk`` or ``campaign_id``).
    """

    def has_object_permission(self, request, view, obj):
        campaign = getattr(obj, "campaign", obj)
        return campaign.owner_id == request.user.id
