from rest_framework.authentication import BaseAuthentication


class ClerkAuthentication(BaseAuthentication):
    """
    Reads the AppUser already resolved by ClerkAuthMiddleware.
    The middleware handles JWT validation and returns 401 before the view
    is reached, so by the time DRF calls authenticate() the user is guaranteed
    to be present on the underlying Django request.
    """

    def authenticate(self, request):
        user = getattr(request._request, "clerk_user", None)
        if user is None:
            return None
        return (user, None)
