from apps.campaigns.models.campaign import Campaign
from apps.campaigns.constants import CAMPAIGN_STATUS_DRAFT


def create_campaign(owner, title, description, survey, status=CAMPAIGN_STATUS_DRAFT, metadata=None):
    """Create a new campaign."""
    return Campaign.objects.create(
        owner=owner,
        title=title,
        description=description,
        survey=survey,
        status=status,
        metadata=metadata or {},
    )


def update_campaign(campaign, **fields):
    """Update a campaign's fields."""
    for field, value in fields.items():
        setattr(campaign, field, value)
    campaign.save()
    return campaign


def delete_campaign(campaign):
    """Delete a campaign."""
    campaign.delete()


def get_campaign_for_owner(campaign_id, owner):
    """Retrieve a campaign by id, scoped to owner."""
    return Campaign.objects.get(pk=campaign_id, owner=owner)


def list_campaigns_for_owner(owner):
    """List all campaigns for a given owner."""
    return Campaign.objects.filter(owner=owner).prefetch_related("audiences")
