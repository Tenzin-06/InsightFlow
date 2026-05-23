from rest_framework import viewsets, status
from rest_framework.response import Response
from apps.authentication.permissions import IsAuthenticated
from apps.campaigns.models.campaign import Campaign
from apps.campaigns.serializers.campaign_serializer import CampaignSerializer
from apps.campaigns.permissions import IsCampaignOwner


class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]
    pagination_class = None

    def get_queryset(self):
        return Campaign.objects.filter(owner=self.request.user).prefetch_related("audiences")

    def get_permissions(self):
        if self.action in ("list", "create"):
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsCampaignOwner()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

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
