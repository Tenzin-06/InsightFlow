# ---------------------------------------------------------------------------
# Optimization Rule Trigger Types
# ---------------------------------------------------------------------------
TRIGGER_NON_RESPONSE = "non_response"
TRIGGER_DROPOFF_DETECTED = "dropoff_detected"

TRIGGER_TYPE_CHOICES = [
    (TRIGGER_NON_RESPONSE, "Non-Response"),
    (TRIGGER_DROPOFF_DETECTED, "Drop-Off Detected"),
]

# ---------------------------------------------------------------------------
# Engagement Segment Types
# ---------------------------------------------------------------------------
SEGMENT_COMPLETED = "completed"
SEGMENT_OPENED_NOT_CLICKED = "opened_not_clicked"
SEGMENT_CLICKED_NOT_STARTED = "clicked_not_started"
SEGMENT_STARTED_NOT_COMPLETED = "started_not_completed"
SEGMENT_INACTIVE = "inactive"

SEGMENT_TYPE_CHOICES = [
    (SEGMENT_COMPLETED, "Completed"),
    (SEGMENT_OPENED_NOT_CLICKED, "Opened Not Clicked"),
    (SEGMENT_CLICKED_NOT_STARTED, "Clicked Not Started"),
    (SEGMENT_STARTED_NOT_COMPLETED, "Started Not Completed"),
    (SEGMENT_INACTIVE, "Inactive"),
]

# ---------------------------------------------------------------------------
# Optimization Event Types
# ---------------------------------------------------------------------------
OPT_EVENT_REMINDER_SENT = "reminder_sent"
OPT_EVENT_SEGMENT_CHANGED = "segment_changed"
OPT_EVENT_AUTOMATION_SKIPPED = "automation_skipped"

OPT_EVENT_TYPE_CHOICES = [
    (OPT_EVENT_REMINDER_SENT, "Reminder Sent"),
    (OPT_EVENT_SEGMENT_CHANGED, "Segment Changed"),
    (OPT_EVENT_AUTOMATION_SKIPPED, "Automation Skipped"),
]

# ---------------------------------------------------------------------------
# Follow-Up Execution Statuses
# ---------------------------------------------------------------------------
EXECUTION_STATUS_PENDING = "pending"
EXECUTION_STATUS_EVALUATING = "evaluating"
EXECUTION_STATUS_OPTIMIZED = "optimized"
EXECUTION_STATUS_SKIPPED = "skipped"
EXECUTION_STATUS_FAILED = "failed"

EXECUTION_STATUS_CHOICES = [
    (EXECUTION_STATUS_PENDING, "Pending"),
    (EXECUTION_STATUS_EVALUATING, "Evaluating"),
    (EXECUTION_STATUS_OPTIMIZED, "Optimized"),
    (EXECUTION_STATUS_SKIPPED, "Skipped"),
    (EXECUTION_STATUS_FAILED, "Failed"),
]

# ---------------------------------------------------------------------------
# Reminder Frequency Defaults
# ---------------------------------------------------------------------------
DEFAULT_MAX_REMINDERS_PER_CAMPAIGN = 3
DEFAULT_MIN_REMINDER_GAP_HOURS = 24
DEFAULT_MAX_AUTOMATION_DURATION_DAYS = 14

# ---------------------------------------------------------------------------
# Trigger.dev task IDs
# ---------------------------------------------------------------------------
TRIGGER_TASK_PROCESS_NONRESPONDENTS = "process-nonrespondents"
TRIGGER_TASK_EVALUATE_OPT_RULES = "evaluate-opt-rules"
TRIGGER_TASK_TRIGGER_FOLLOWUPS = "trigger-followups"
TRIGGER_TASK_GENERATE_SEGMENTS = "generate-segments"
