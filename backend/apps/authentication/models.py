from django.db import models
from django.contrib.auth.hashers import make_password, check_password as django_check_password
from apps.core.models import TimeStampedModel


class AppUser(TimeStampedModel):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "app_users"

    def __str__(self):
        return self.email

    # --- password helpers ---
    def set_password(self, raw_password: str) -> None:
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return django_check_password(raw_password, self.password)

    # --- DRF / Django auth protocol ---
    @property
    def is_authenticated(self) -> bool:  # type: ignore[override]
        return self.is_active

    @property
    def is_anonymous(self) -> bool:
        return False
