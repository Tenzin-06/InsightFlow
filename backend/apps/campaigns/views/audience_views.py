from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.authentication.permissions import IsAuthenticated
from apps.campaigns.models.audience import Audience
from apps.campaigns.models.recipient import Recipient
from apps.campaigns.serializers.audience_serializer import AudienceSerializer
from apps.campaigns.serializers.recipient_serializer import RecipientSerializer
from apps.campaigns.permissions import IsAudienceOwner
from apps.campaigns.services.upload_service import process_bulk_upload


class AudienceViewSet(viewsets.ModelViewSet):
    serializer_class = AudienceSerializer
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]
    pagination_class = None

    def get_queryset(self):
        return Audience.objects.filter(owner=self.request.user).prefetch_related("recipients")

    def get_permissions(self):
        if self.action in ("list", "create"):
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAudienceOwner()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    # ------------------------------------------------------------------ CRUD

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"success": True, "data": serializer.data, "error": None})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"success": True, "data": serializer.data, "error": None},
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({"success": True, "data": serializer.data, "error": None})

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "data": serializer.data, "error": None})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    # ----------------------------------------------------------- Upload action

    @action(
        detail=True,
        methods=["post"],
        url_path="upload",
        permission_classes=[IsAuthenticated, IsAudienceOwner],
    )
    def upload(self, request, pk=None):
        """
        POST /api/v1/audiences/:id/upload/

        Body:
            { "contacts": [{ "email": "...", "first_name": "...", "last_name": "..." }] }

        Returns:
            { "success": true, "data": { "uploaded": N, "duplicates": N, "invalid": N } }
        """
        audience = self.get_object()
        contacts = request.data.get("contacts", [])

        if not isinstance(contacts, list):
            return Response(
                {"success": False, "data": None, "error": {"message": "contacts must be a list."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(contacts) == 0:
            return Response(
                {"success": False, "data": None, "error": {"message": "No contacts provided."}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        summary = process_bulk_upload(audience, contacts)
        return Response({"success": True, "data": summary, "error": None}, status=status.HTTP_200_OK)

    # --------------------------------------------------------- Recipients list

    @action(
        detail=True,
        methods=["get"],
        url_path="recipients",
        permission_classes=[IsAuthenticated, IsAudienceOwner],
    )
    def recipients(self, request, pk=None):
        """
        GET /api/v1/audiences/:id/recipients/?q=<search>&limit=<n>&offset=<n>

        Returns paginated, optionally searched recipient list.
        """
        from django.db.models import Q

        audience = self.get_object()
        qs = Recipient.objects.filter(audience=audience).order_by("-created_at")

        # Optional search by email / first_name / last_name
        query = request.query_params.get("q", "").strip()
        if query:
            qs = qs.filter(
                Q(email__icontains=query)
                | Q(first_name__icontains=query)
                | Q(last_name__icontains=query)
            )

        # Lightweight manual pagination
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
