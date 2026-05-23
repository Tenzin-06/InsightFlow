import type { DashboardOverview, SurveyAnalyticsSummary, CampaignAnalyticsSummary, EngagementSummary } from "@/features/analytics/types";

// ─── Chart palette ────────────────────────────────────────────────────────────

export const CHART_COLORS = {
  primary: "#3B82F6",
  primaryLight: "#BFDBFE",
  secondary: "#14B8A6",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  muted: "#CBD5E1",
  purple: "#8B5CF6",
} as const;

export const PIE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.purple,
  CHART_COLORS.muted,
] as const;

// ─── Mock: dashboard overview ─────────────────────────────────────────────────

export const MOCK_DASHBOARD_OVERVIEW: DashboardOverview = {
  totalResponses: 1_248,
  completionRate: 72.4,
  openRate: 58.3,
  clickRate: 34.7,
  dropOffRate: 27.6,
  responseTrend: [
    { date: "Jan", value: 80 },
    { date: "Feb", value: 115 },
    { date: "Mar", value: 98 },
    { date: "Apr", value: 142 },
    { date: "May", value: 178 },
    { date: "Jun", value: 195 },
    { date: "Jul", value: 210 },
    { date: "Aug", value: 230 },
  ],
  topSurveys: [
    { title: "Customer Satisfaction Q3", responses: 342 },
    { title: "Product Feedback Survey", responses: 218 },
    { title: "Employee Wellness Check", responses: 190 },
    { title: "Post-Event Feedback", responses: 157 },
    { title: "Market Research 2024", responses: 141 },
  ],
};

// ─── Mock: survey analytics ───────────────────────────────────────────────────

export const MOCK_SURVEY_ANALYTICS: SurveyAnalyticsSummary = {
  surveyId: "1",
  title: "Customer Satisfaction Q3",
  totalResponses: 342,
  completionRate: 74.5,
  avgCompletionTime: "4m 12s",
  dropOffRate: 25.5,
  responseTrend: [
    { date: "Week 1", value: 45 },
    { date: "Week 2", value: 82 },
    { date: "Week 3", value: 110 },
    { date: "Week 4", value: 105 },
  ],
  completionFunnel: [
    { label: "Opened survey", value: 459, percentage: 100 },
    { label: "Started survey", value: 390, percentage: 84.9 },
    { label: "Reached Q5", value: 354, percentage: 77.1 },
    { label: "Completed", value: 255, percentage: 55.5 },
  ],
  questionEngagement: [
    { name: "Q1 – Satisfaction", value: 98, fill: "#3B82F6" },
    { name: "Q2 – Recommend", value: 95, fill: "#14B8A6" },
    { name: "Q3 – Features", value: 88, fill: "#22C55E" },
    { name: "Q4 – Support", value: 80, fill: "#F59E0B" },
    { name: "Q5 – Comments", value: 62, fill: "#8B5CF6" },
  ],
};

// ─── Mock: campaign analytics ─────────────────────────────────────────────────

export const MOCK_CAMPAIGN_ANALYTICS: CampaignAnalyticsSummary = {
  campaignId: "1",
  title: "Customer Satisfaction Campaign",
  sentCount: 800,
  openRate: 61.3,
  clickRate: 38.5,
  responseConversion: 42.8,
  reminderPerformance: [
    { name: "Initial Send", value: 490, fill: "#3B82F6" },
    { name: "Reminder 1", value: 148, fill: "#14B8A6" },
    { name: "Reminder 2", value: 82, fill: "#F59E0B" },
    { name: "Final Reminder", value: 24, fill: "#CBD5E1" },
  ],
  openTrend: [
    { date: "Day 1", value: 310, secondary: 195 },
    { date: "Day 2", value: 82, secondary: 60 },
    { date: "Day 3", value: 55, secondary: 38 },
    { date: "Day 5", value: 25, secondary: 18 },
    { date: "Day 7", value: 18, secondary: 11 },
  ],
};

// ─── Mock: engagement analytics ───────────────────────────────────────────────

export const MOCK_ENGAGEMENT: EngagementSummary = {
  engagementFunnel: [
    { label: "Email sent", value: 1_200, percentage: 100 },
    { label: "Email opened", value: 740, percentage: 61.7 },
    { label: "Survey started", value: 510, percentage: 42.5 },
    { label: "Survey completed", value: 342, percentage: 28.5 },
  ],
  dropOffPoints: [
    { name: "Before Q1", value: 168, fill: "#EF4444" },
    { name: "Q1 → Q2", value: 48, fill: "#F59E0B" },
    { name: "Q2 → Q3", value: 32, fill: "#F59E0B" },
    { name: "Q3 → Q4", value: 28, fill: "#CBD5E1" },
    { name: "Q4 → Q5", value: 24, fill: "#CBD5E1" },
  ],
  interactionTimeline: [
    { date: "Mon", value: 95 },
    { date: "Tue", value: 130 },
    { date: "Wed", value: 118 },
    { date: "Thu", value: 145 },
    { date: "Fri", value: 102 },
    { date: "Sat", value: 48 },
    { date: "Sun", value: 35 },
  ],
  segmentBreakdown: [
    { name: "Academic", value: 38, fill: "#3B82F6" },
    { name: "Government", value: 24, fill: "#14B8A6" },
    { name: "Corporate", value: 22, fill: "#22C55E" },
    { name: "Individual", value: 16, fill: "#CBD5E1" },
  ],
};
