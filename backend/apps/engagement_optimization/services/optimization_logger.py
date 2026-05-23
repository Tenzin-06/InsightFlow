"""
optimization_logger.py
~~~~~~~~~~~~~~~~~~~~~~
Centralized structured logging for the Engagement Optimization system.

Logs:
- rule evaluations
- reminder triggers
- skipped actions
- optimization failures
- segmentation updates
"""

import logging

logger = logging.getLogger("engagement_optimization")


def log_rule_evaluated(*, rule_name: str, campaign_id: int, eligible_count: int) -> None:
    logger.info(
        "Optimization rule evaluated",
        extra={
            "rule_name": rule_name,
            "campaign_id": campaign_id,
            "eligible_count": eligible_count,
        },
    )


def log_reminder_triggered(*, campaign_id: int, recipient_email: str, rule_name: str) -> None:
    logger.info(
        "Optimization reminder triggered",
        extra={
            "campaign_id": campaign_id,
            "recipient_email": recipient_email,
            "rule_name": rule_name,
        },
    )


def log_action_skipped(*, campaign_id: int, recipient_email: str, reason: str) -> None:
    logger.info(
        "Optimization action skipped",
        extra={
            "campaign_id": campaign_id,
            "recipient_email": recipient_email,
            "reason": reason,
        },
    )


def log_optimization_failure(*, campaign_id: int, error: str) -> None:
    logger.error(
        "Optimization workflow failed",
        extra={
            "campaign_id": campaign_id,
            "error": error,
        },
    )


def log_segment_updated(
    *, campaign_id: int, recipient_email: str, old_segment: str, new_segment: str
) -> None:
    logger.info(
        "Engagement segment updated",
        extra={
            "campaign_id": campaign_id,
            "recipient_email": recipient_email,
            "old_segment": old_segment,
            "new_segment": new_segment,
        },
    )
