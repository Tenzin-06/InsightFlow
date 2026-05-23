from rest_framework.permissions import AllowAny


class PublicSharingPermission(AllowAny):
    """Public endpoint — no authentication required for share metadata."""
    pass
