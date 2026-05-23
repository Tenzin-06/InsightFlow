from rest_framework.routers import DefaultRouter
from apps.campaigns.views.campaign_views import CampaignViewSet
from apps.campaigns.views.audience_views import AudienceViewSet

router = DefaultRouter()
router.register("campaigns", CampaignViewSet, basename="campaign")
router.register("audiences", AudienceViewSet, basename="audience")

urlpatterns = router.urls
