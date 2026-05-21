from django.db import models
from apps.core.models import TimeStampedModel


class AppUser(TimeStampedModel):
    clerk_user_id = models.CharField(max_length=255, unique=True, db_index=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "app_users"

    def __str__(self):
        return self.email
