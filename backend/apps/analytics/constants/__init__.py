# Analytics snapshot types
SNAPSHOT_TYPE_SURVEY = "survey"
SNAPSHOT_TYPE_CAMPAIGN = "campaign"
SNAPSHOT_TYPE_ENGAGEMENT = "engagement"
SNAPSHOT_TYPE_DASHBOARD = "dashboard"

SNAPSHOT_TYPE_CHOICES = [
    (SNAPSHOT_TYPE_SURVEY, "Survey"),
    (SNAPSHOT_TYPE_CAMPAIGN, "Campaign"),
    (SNAPSHOT_TYPE_ENGAGEMENT, "Engagement"),
    (SNAPSHOT_TYPE_DASHBOARD, "Dashboard"),
]

# Metric name identifiers
METRIC_TOTAL_RESPONSES = "total_responses"
METRIC_COMPLETION_RATE = "completion_rate"
METRIC_OPEN_RATE = "open_rate"
METRIC_CLICK_RATE = "click_rate"
METRIC_RESPONSE_RATE = "response_rate"
METRIC_EMAILS_SENT = "emails_sent"
METRIC_DELIVERY_RATE = "delivery_rate"

# Cache configuration
ANALYTICS_CACHE_TTL = 60 * 15  # 15 minutes
DASHBOARD_CACHE_TTL = 60 * 10  # 10 minutes
TREND_CACHE_TTL = 60 * 30     # 30 minutes

# Time-series defaults
DEFAULT_TREND_DAYS = 30
MAX_TREND_DAYS = 365
TOP_SURVEYS_LIMIT = 5

# Pagination
ANALYTICS_PAGE_SIZE = 20
