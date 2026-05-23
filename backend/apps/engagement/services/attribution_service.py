from apps.engagement.models import TrackingToken
from apps.engagement.utils import get_public_backend_url
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse


def create_tracking_token(campaign, recipient, destination_url: str) -> TrackingToken:
    tracking_token = TrackingToken.objects.create(
        campaign=campaign,
        survey=campaign.survey,
        recipient=recipient,
        recipient_email=getattr(recipient, "email", ""),
        destination_url=destination_url,
    )
    tracking_token.destination_url = append_tracking_token(destination_url, tracking_token.token)
    tracking_token.save(update_fields=["destination_url"])
    return tracking_token


def append_tracking_token(destination_url: str, token) -> str:
    parsed = urlparse(destination_url)
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))
    query["t"] = str(token)
    return urlunparse(parsed._replace(query=urlencode(query)))


def resolve_tracking_token(token_value) -> TrackingToken | None:
    try:
        return (
            TrackingToken.objects.select_related("campaign", "survey", "recipient")
            .get(token=token_value, is_active=True)
        )
    except TrackingToken.DoesNotExist:
        return None


def build_tracking_urls(tracking_token: TrackingToken) -> dict:
    base_url = get_public_backend_url()
    token = tracking_token.token
    return {
        "open_url": f"{base_url}/track/open/{token}.png",
        "click_url": f"{base_url}/track/click/{token}/",
    }
