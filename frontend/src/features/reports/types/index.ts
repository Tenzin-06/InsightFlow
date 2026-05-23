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
