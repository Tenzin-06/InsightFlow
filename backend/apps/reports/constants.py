REPORT_TEMPLATE_EXECUTIVE = "executive_summary"
REPORT_TEMPLATE_ACADEMIC = "academic_report"
REPORT_TEMPLATE_CAMPAIGN = "campaign_report"
REPORT_TEMPLATE_AI_INSIGHTS = "ai_insight_report"

REPORT_TEMPLATE_CHOICES = [
    (REPORT_TEMPLATE_EXECUTIVE, "Executive Summary"),
    (REPORT_TEMPLATE_ACADEMIC, "Academic Report"),
    (REPORT_TEMPLATE_CAMPAIGN, "Campaign Report"),
    (REPORT_TEMPLATE_AI_INSIGHTS, "AI Insights Report"),
]

REPORT_TEMPLATES = {
    REPORT_TEMPLATE_EXECUTIVE: {
        "id": REPORT_TEMPLATE_EXECUTIVE,
        "name": "Executive Summary",
        "description": "KPI-focused survey analytics export.",
        "sections": ["metrics", "charts", "ai_insights", "conclusions"],
    },
    REPORT_TEMPLATE_ACADEMIC: {
        "id": REPORT_TEMPLATE_ACADEMIC,
        "name": "Academic Report",
        "description": "Structured research report with question-level detail.",
        "sections": ["metrics", "charts", "question_breakdown", "ai_insights", "conclusions"],
    },
    REPORT_TEMPLATE_CAMPAIGN: {
        "id": REPORT_TEMPLATE_CAMPAIGN,
        "name": "Campaign Report",
        "description": "Distribution, funnel, and engagement performance report.",
        "sections": ["metrics", "charts", "engagement", "conclusions"],
    },
    REPORT_TEMPLATE_AI_INSIGHTS: {
        "id": REPORT_TEMPLATE_AI_INSIGHTS,
        "name": "AI Insights Report",
        "description": "AI-labeled summaries, sentiment, quality, and recommendations.",
        "sections": ["metrics", "ai_insights", "question_breakdown", "conclusions"],
    },
}

REPORT_SECTION_CHOICES = [
    "metrics",
    "charts",
    "engagement",
    "question_breakdown",
    "ai_insights",
    "conclusions",
]

REPORT_STATUS_QUEUED = "queued"
REPORT_STATUS_PREPARING = "preparing"
REPORT_STATUS_PROCESSING_ASSETS = "processing_assets"
REPORT_STATUS_RENDERING = "rendering"
REPORT_STATUS_FINALIZING = "finalizing"
REPORT_STATUS_COMPLETED = "completed"
REPORT_STATUS_FAILED = "failed"

REPORT_STATUS_CHOICES = [
    (REPORT_STATUS_QUEUED, "Queued"),
    (REPORT_STATUS_PREPARING, "Preparing"),
    (REPORT_STATUS_PROCESSING_ASSETS, "Processing Assets"),
    (REPORT_STATUS_RENDERING, "Rendering"),
    (REPORT_STATUS_FINALIZING, "Finalizing"),
    (REPORT_STATUS_COMPLETED, "Completed"),
    (REPORT_STATUS_FAILED, "Failed"),
]

