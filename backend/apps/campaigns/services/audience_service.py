from apps.campaigns.models.audience import Audience


def create_audience(owner, name, description="", metadata=None):
    """Create a new audience."""
    return Audience.objects.create(
        owner=owner,
        name=name,
        description=description,
        metadata=metadata or {},
    )


def update_audience(audience, **fields):
    """Update an audience's fields."""
    for field, value in fields.items():
        setattr(audience, field, value)
    audience.save()
    return audience


def delete_audience(audience):
    """Delete an audience."""
    audience.delete()


def get_audience_for_owner(audience_id, owner):
    """Retrieve an audience by id, scoped to owner."""
    return Audience.objects.get(pk=audience_id, owner=owner)


def list_audiences_for_owner(owner):
    """List all audiences for a given owner."""
    return Audience.objects.filter(owner=owner).prefetch_related("recipients")
