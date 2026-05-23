// ─── Metric / KPI types ────────────────────────────────────────────────────

export type TrendDirection = "up" | "down" | "neutral";

export type MetricCardData = {
  label: string;
  value: string | number;
  /** e.g. "+12%" or "−3%" */
  change?: string;
  trend?: TrendDirection;
  /** Lucide icon name or component — kept loose so callers can pass any icon */
  icon?: React.ElementType;
  description?: string;
};

// ─── Chart data shapes ──────────────────────────────────────────────────────

export type TimeSeriesPoint = {
  date: string;
  value: number;
  secondary?: number;
};

export type CategoryPoint = {
  name: string;
  value: number;
  fill?: string;
};

export type FunnelStep = {
  label: string;
  value: number;
  percentage: number;
};

// ─── Survey analytics ────────────────────────────────────────────────────────

export type SurveyAnalyticsSummary = {
  surveyId: string;
  title: string;
  totalResponses: number;
  completionRate: number;
  avgCompletionTime: string;
  dropOffRate: number;
  responseTrend: TimeSeriesPoint[];
  completionFunnel: FunnelStep[];
  questionEngagement: CategoryPoint[];
};

// ─── Campaign analytics ───────────────────────────────────────────────────────

export type CampaignAnalyticsSummary = {
  campaignId: string;
  title: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
  responseConversion: number;
  reminderPerformance: CategoryPoint[];
  openTrend: TimeSeriesPoint[];
};

// ─── Engagement analytics ─────────────────────────────────────────────────────

export type EngagementSummary = {
  engagementFunnel: FunnelStep[];
  dropOffPoints: CategoryPoint[];
  interactionTimeline: TimeSeriesPoint[];
  segmentBreakdown: CategoryPoint[];
};

// ─── Dashboard overview ───────────────────────────────────────────────────────

export type DashboardOverview = {
  totalResponses: number;
  completionRate: number;
  openRate: number;
  clickRate: number;
  dropOffRate: number;
  responseTrend: TimeSeriesPoint[];
  topSurveys: { title: string; responses: number }[];
};
