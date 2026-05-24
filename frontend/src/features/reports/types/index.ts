// ─── Report Template ────────────────────────────────────────────────────────

export type ReportSectionKey =
  | "cover"
  | "executive_summary"
  | "metrics_overview"
  | "charts_analytics"
  | "ai_insights"
  | "sentiment_analysis"
  | "question_breakdown"
  | "conclusions";

export type ReportTemplate = {
  id: string;
  name: string;
  description: string;
  purpose: string;
  recommendedFor: string;
  sections: ReportSectionKey[];
  thumbnail?: string;
};

// ─── Report Configuration ────────────────────────────────────────────────────

export type ReportConfig = {
  title: string;
  templateId: string;
  sections: ReportSectionKey[];
  surveyId?: string;
  dateRangeFrom?: string;
  dateRangeTo?: string;
  includeCharts: boolean;
  includeAiInsights: boolean;
  organization?: string;
};

// ─── Export Workflow ─────────────────────────────────────────────────────────

export type ExportStatus =
  | "idle"
  | "preparing"
  | "rendering"
  | "processing_charts"
  | "finalizing"
  | "completed"
  | "failed";

export type ExportRecord = {
  id: string;
  reportTitle: string;
  templateName: string;
  exportedAt: string;
  status: ExportStatus;
  fileUrl?: string;
};

// ─── Preview State ───────────────────────────────────────────────────────────

export type ReportPreviewState = {
  isVisible: boolean;
  currentPage: number;
  totalPages: number;
  zoom: number; // 0.5 – 2.0
};

// ─── Analytics Data (for rendering blocks) ───────────────────────────────────

export type ReportMetric = {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  change?: string;
};

export type ReportChartData = {
  name: string;
  value: number;
  secondary?: number;
};

export type ReportInsight = {
  id: string;
  type: "summary" | "sentiment" | "recommendation" | "quality";
  title: string;
  body: string;
  score?: number;
};

// ─── Gemini-generated dynamic report payload ──────────────────────────────────

export type GeneratedReportData = {
  /** Survey title pulled from the database. */
  survey_title: string;
  /** ISO-8601 timestamp of when the payload was generated. */
  generated_at: string;
  /** High-level KPI metrics for the MetricsOverview section. */
  metrics: {
    total_responses: number;
    completion_rate: string;   // e.g. "68%"
    drop_off_rate: string;     // e.g. "32%"
    question_count: number;
  };
  /** Serialised chart data for visualisation blocks. */
  chart_data: {
    response_trend: Array<{ date?: string; count?: number; name?: string; value?: number }>;
    sentiment_distribution: Array<{ name: string; value: number }>;
    question_engagement: Array<{
      question_id?: number;
      question_text: string;
      engagement_rate: number;
      answer_count: number;
      order?: number;
    }>;
  };
  /** Gemini-generated 3-4 sentence executive summary. */
  executive_summary: string;
  /** Gemini-generated data-driven bullet points. */
  key_findings: string[];
  /** Array of structured AI insight cards (summary, sentiment, quality, recommendation). */
  ai_insights: ReportInsight[];
  /** Sentiment breakdown from AI analytics. */
  sentiment: {
    dominant: string;
    distribution: Record<string, number>;
    confidence: number;
    reasoning: string;
  };
  /** Per-question engagement data for the question breakdown section. */
  question_breakdown: Array<{
    question_text: string;
    engagement_rate: number;
    answer_count: number;
  }>;
  /** Gemini-generated 2-3 sentence conclusion. */
  conclusions: string;
  /** Overall data quality rating derived from AI quality scoring. */
  data_quality: "high" | "medium" | "low" | "unknown";
  /** True when Gemini successfully generated the narrative content. */
  ai_generated: boolean;
};
