import type {
  ReportTemplate,
  ReportSectionKey,
  ExportRecord,
  ReportMetric,
  ReportChartData,
  ReportInsight,
} from "../types";

// ─── Report Templates ────────────────────────────────────────────────────────

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "executive_summary",
    name: "Executive Summary",
    description: "High-level analytics overview for leadership and stakeholders.",
    purpose: "High-level analytics",
    recommendedFor: "Leadership presentations, stakeholder briefings",
    sections: ["cover", "executive_summary", "metrics_overview", "ai_insights", "conclusions"],
  },
  {
    id: "academic_research",
    name: "Academic Research Report",
    description:
      "Detailed survey reporting with full question breakdown and sentiment analysis.",
    purpose: "Detailed survey reporting",
    recommendedFor: "Academic papers, research publications, thesis work",
    sections: [
      "cover",
      "executive_summary",
      "metrics_overview",
      "charts_analytics",
      "sentiment_analysis",
      "question_breakdown",
      "ai_insights",
      "conclusions",
    ],
  },
  {
    id: "campaign_performance",
    name: "Campaign Performance Report",
    description: "Distribution metrics and campaign engagement analytics.",
    purpose: "Distribution metrics",
    recommendedFor: "Marketing teams, campaign reviews",
    sections: [
      "cover",
      "executive_summary",
      "metrics_overview",
      "charts_analytics",
      "conclusions",
    ],
  },
  {
    id: "ai_insights_report",
    name: "AI Insights Report",
    description:
      "AI-powered analytics with sentiment, summaries, and quality scoring.",
    purpose: "AI-powered analytics",
    recommendedFor: "Data teams, AI-driven insights review",
    sections: ["cover", "executive_summary", "ai_insights", "sentiment_analysis", "conclusions"],
  },
  {
    id: "engagement_analytics",
    name: "Engagement Analytics Report",
    description: "Participation analysis with drop-off detection and engagement funnel.",
    purpose: "Participation analysis",
    recommendedFor: "Survey researchers, UX analysts, engagement teams",
    sections: [
      "cover",
      "executive_summary",
      "metrics_overview",
      "charts_analytics",
      "question_breakdown",
      "conclusions",
    ],
  },
];

// ─── Section Metadata ─────────────────────────────────────────────────────────

export const REPORT_SECTION_LABELS: Record<ReportSectionKey, string> = {
  cover: "Cover Page",
  executive_summary: "Executive Summary",
  metrics_overview: "Metrics Overview",
  charts_analytics: "Charts & Analytics",
  ai_insights: "AI Insights",
  sentiment_analysis: "Sentiment Analysis",
  question_breakdown: "Question Breakdown",
  conclusions: "Conclusions",
};

export const REPORT_SECTION_DESCRIPTIONS: Record<ReportSectionKey, string> = {
  cover: "Professional title page with report metadata",
  executive_summary: "High-level overview and key findings",
  metrics_overview: "Core KPI cards — response rate, completion rate, total responses",
  charts_analytics: "Bar, line, and pie charts from survey analytics",
  ai_insights: "AI-generated summaries and recommendations",
  sentiment_analysis: "Sentiment breakdown across responses",
  question_breakdown: "Per-question response analytics",
  conclusions: "Final notes and closing observations",
};

export const OPTIONAL_SECTIONS: ReportSectionKey[] = [
  "executive_summary",
  "metrics_overview",
  "charts_analytics",
  "ai_insights",
  "sentiment_analysis",
  "question_breakdown",
  "conclusions",
];

// ─── Export Status Labels ─────────────────────────────────────────────────────

export const EXPORT_STATUS_LABELS: Record<string, string> = {
  idle: "Ready to Export",
  preparing: "Preparing layout…",
  rendering: "Rendering PDF…",
  processing_charts: "Processing charts…",
  finalizing: "Finalizing…",
  completed: "Export complete",
  failed: "Export failed",
};

export const EXPORT_STATUS_PROGRESS: Record<string, number> = {
  idle: 0,
  preparing: 20,
  rendering: 45,
  processing_charts: 70,
  finalizing: 90,
  completed: 100,
  failed: 0,
};

// ─── Default configuration ────────────────────────────────────────────────────

export const DEFAULT_REPORT_CONFIG = {
  title: "",
  templateId: "academic_research",
  sections: [
    "cover",
    "executive_summary",
    "metrics_overview",
    "charts_analytics",
    "conclusions",
  ] as ReportSectionKey[],
  includeCharts: true,
  includeAiInsights: false,
  organization: "",
  dateRangeFrom: "",
  dateRangeTo: "",
  surveyId: "",
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_RECENT_EXPORTS: ExportRecord[] = [
  {
    id: "exp-001",
    reportTitle: "Q2 2026 Satisfaction Survey Report",
    templateName: "Academic Research Report",
    exportedAt: "2026-05-20T10:30:00Z",
    status: "completed",
    fileUrl: "#",
  },
  {
    id: "exp-002",
    reportTitle: "Product Feedback — May Summary",
    templateName: "Executive Summary",
    exportedAt: "2026-05-18T14:15:00Z",
    status: "completed",
    fileUrl: "#",
  },
  {
    id: "exp-003",
    reportTitle: "Campaign Distribution — May 2026",
    templateName: "Campaign Performance Report",
    exportedAt: "2026-05-15T09:00:00Z",
    status: "failed",
  },
];

export const MOCK_REPORT_METRICS: ReportMetric[] = [
  { label: "Total Responses", value: 412, trend: "up", change: "+18%" },
  { label: "Response Rate", value: "73%", trend: "up", change: "+5.4%" },
  { label: "Completion Rate", value: "68%", trend: "up", change: "+4.2%" },
  { label: "Avg. Completion Time", value: "4m 32s", trend: "neutral" },
];

export const MOCK_CHART_DATA: ReportChartData[] = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 72 },
  { name: "Mar", value: 58 },
  { name: "Apr", value: 95 },
  { name: "May", value: 147 },
];

export const MOCK_SENTIMENT_DATA: ReportChartData[] = [
  { name: "Positive", value: 61 },
  { name: "Neutral", value: 28 },
  { name: "Negative", value: 11 },
];

export const MOCK_REPORT_INSIGHTS: ReportInsight[] = [
  {
    id: "ins-001",
    type: "summary",
    title: "Overall Survey Performance",
    body:
      "Survey completion rates have improved significantly over the reporting period. Most respondents completed all required questions with minimal drop-off observed in the final section.",
    score: 87,
  },
  {
    id: "ins-002",
    type: "sentiment",
    title: "Respondent Sentiment Analysis",
    body:
      "Sentiment analysis across open-text responses shows predominantly positive attitudes (61%), with neutral responses forming the second-largest segment. Negative sentiment is limited to 11%, concentrated in questions about response time.",
    score: 61,
  },
  {
    id: "ins-003",
    type: "recommendation",
    title: "Recommended Actions",
    body:
      "Consider simplifying questions 4 and 7, which show the highest drop-off rates. Respondents aged 25–34 show the best engagement — targeting this demographic in future campaigns could improve overall completion rates.",
  },
];

export const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25, 1.5] as const;
export const DEFAULT_ZOOM = 1.0;
