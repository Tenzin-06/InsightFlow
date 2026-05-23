from apps.campaigns.models.recipient import Recipient


def create_recipient(audience, email, first_name="", last_name="", metadata=None):
    """Add a recipient to an audience."""
    return Recipient.objects.create(
        audience=audience,
        email=email,
        first_name=first_name,
        last_name=last_name,
        metadata=metadata or {},
    )


def delete_recipient(recipient):
    """Remove a recipient."""
    recipient.delete()


def list_recipients_for_audience(audience):
    """List all recipients for an audience."""
    return Recipient.objects.filter(audience=audience)
