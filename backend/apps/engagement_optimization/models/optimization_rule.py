from django.db import models

from apps.engagement_optimization.constants import (
    TRIGGER_NON_RESPONSE,
    TRIGGER_TYPE_CHOICES,
)


class OptimizationRule(models.Model):
    """
    Configurable rule that drives engagement optimization actions.
    A rule belongs to an owner and optionally scopes to a specific campaign.
    """

    owner = models.ForeignKey(
        "authentication.AppUser",
        related_name="optimization_rules",
        on_delete=models.CASCADE,
    )
    campaign = models.ForeignKey(
        "campaigns.Campaign",
        related_name="optimization_rules",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="If set, rule applies only to this campaign.",
    )
    rule_name = models.CharField(max_length=120)
    trigger_type = models.CharField(
        max_length=40,
        choices=TRIGGER_TYPE_CHOICES,
        default=TRIGGER_NON_RESPONSE,
    )
    delay_days = models.PositiveSmallIntegerField(
        default=3,
        help_text="Days after original send before triggering follow-up.",
    )
    reminder_limit = models.PositiveSmallIntegerField(
        default=1,
        help_text="Maximum number of follow-up reminders this rule may send per recipient.",
    )
    is_active = models.BooleanField(default=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "opt_optimization_rules"
        indexes = [
            models.Index(fields=["owner"], name="opt_rule_owner_idx"),
            models.Index(fields=["campaign"], name="opt_rule_campaign_idx"),
            models.Index(fields=["trigger_type"], name="opt_rule_trigger_idx"),
            models.Index(fields=["is_active"], name="opt_rule_active_idx"),
        ]
        ordering = ["rule_name"]

    def __str__(self):
        return f"{self.rule_name} ({self.trigger_type})"
