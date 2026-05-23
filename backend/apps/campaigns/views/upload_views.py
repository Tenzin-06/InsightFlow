"""
upload_views.py — Standalone upload and recipient-listing class-based views.

These classes are wired as extra URL patterns alongside the DRF router in
urls.py, providing the same upload/recipients endpoints as the @action
decorators on AudienceViewSet — useful for explicit URL configuration or
testing without the router.
"""
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.authentication.permissions import IsAuthenticated
from apps.campaigns.models.audience import Audience
from apps.campaigns.models.recipient import Recipient
from apps.campaigns.permissions import IsAudienceOwner
from apps.campaigns.serializers.recipient_serializer import RecipientSerializer
from apps.campaigns.services.upload_service import process_bulk_upload


def _get_owned_audience(request, pk, view):
    """Return (audience, None) or (None, error_response)."""
    audience = get_object_or_404(Audience, pk=pk)
    perm = IsAudienceOwner()
    if not perm.has_object_permission(request, view, audience):
        return None, Response(
            {"success": False, "data": None, "error": {"message": "Permission denied."}},
            status=status.HTTP_403_FORBIDDEN,
        )
    return audience, None


class UploadContactsView(APIView):
    """
    POST /api/v1/audiences/<pk>/upload/

    Accepts:
        { "contacts": [{ "email": "...", "first_name": "...", "last_name": "..." }] }

    Returns upload summary:
        { "uploaded": N, "duplicates": N, "invalid": N }
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        audience, err = _get_owned_audience(request, pk, self)
        if err:
            return err

        contacts = request.data.get("contacts", [])
        if not isinstance(contacts, list):
            return Response(
                {"success": False, "data": None, "error": {"message": "contacts must be a list."}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not contacts:
            return Response(
                {"success": False, "data": None, "error": {"message": "No contacts provided."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        summary = process_bulk_upload(audience, contacts)
        return Response({"success": True, "data": summary, "error": None}, status=status.HTTP_200_OK)


class RecipientListView(APIView):
    """
    GET /api/v1/audiences/<pk>/recipients/?q=<search>&limit=<n>&offset=<n>

    Returns paginated, optionally searched recipient list.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        audience, err = _get_owned_audience(request, pk, self)
        if err:
            return err

        qs = Recipient.objects.filter(audience=audience).order_by("-created_at")

        query = request.query_params.get("q", "").strip()
        if query:
            qs = qs.filter(
                Q(email__icontains=query)
                | Q(first_name__icontains=query)
                | Q(last_name__icontains=query)
            )

        try:
            limit = int(request.query_params.get("limit", 50))
            offset = int(request.query_params.get("offset", 0))
        except ValueError:
            limit, offset = 50, 0

        total = qs.count()
        page = qs[offset: offset + limit]
        serializer = RecipientSerializer(page, many=True)

        return Response({
            "success": True,
            "data": {
                "count": total,
                "limit": limit,
                "offset": offset,
                "results": serializer.data,
            },
            "error": None,
        })
