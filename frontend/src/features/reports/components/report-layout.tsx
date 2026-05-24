/**
 * report-layout.tsx
 *
 * Renders every section of an InsightFlow report.
 *
 * When `reportData` is supplied (i.e. after a successful Gemini generation),
 * every section is populated from real survey data.  When it is absent the
 * layout renders skeleton placeholder cards so the user can see the structure
 * before generating.
 */

import { Brain } from "lucide-react";
import { ReportHeader } from "./report-header";
import { ReportFooter } from "./report-footer";
import { ReportCover } from "./report-cover";
import { ReportMetricsBlock } from "./report-metrics-block";
import { ReportChartBlock } from "./report-chart-block";
import { ReportInsightBlock } from "./report-insight-block";
import { REPORT_SECTION_LABELS } from "../constants";
import type {
  ReportConfig,
  ReportSectionKey,
  ReportMetric,
  ReportChartData,
  GeneratedReportData,
} from "../types";

// ─── Props ────────────────────────────────────────────────────────────────────

type ReportLayoutProps = {
  config: ReportConfig;
  currentPage?: number;
  totalPages?: number;
  /** When present, every section renders real Gemini-generated data. */
  reportData?: GeneratedReportData | null;
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

function SectionWrapper({
  children,
  sectionKey,
  config,
  pageNumber,
  totalPages,
}: {
  children: React.ReactNode;
  sectionKey: ReportSectionKey;
  config: ReportConfig;
  pageNumber: number;
  totalPages: number;
}) {
  if (sectionKey === "cover") return <>{children}</>;
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border-default bg-white p-6 shadow-sm dark:bg-card">
      <ReportHeader
        reportTitle={config.title || "Untitled Report"}
        sectionTitle={REPORT_SECTION_LABELS[sectionKey]}
      />
      <div>{children}</div>
      <ReportFooter pageNumber={pageNumber} totalPages={totalPages} />
    </div>
  );
}

// ─── Skeleton block ───────────────────────────────────────────────────────────

function SkeletonBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={[
            "h-3 rounded-full bg-border-default",
            i === lines - 1 ? "w-2/3" : "w-full",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ─── "Not generated yet" banner ───────────────────────────────────────────────

function NotGeneratedBanner() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-bg-muted p-4 text-sm text-text-muted">
      <Brain className="h-4 w-4 shrink-0 text-ai-400" aria-hidden="true" />
      <span>Generate the report to see AI-powered content for this section.</span>
    </div>
  );
}

// ─── Section renderers ────────────────────────────────────────────────────────

function renderSection(
  key: ReportSectionKey,
  config: ReportConfig,
  reportData: GeneratedReportData | null | undefined,
): React.ReactNode {
  const hasData = !!reportData;

  switch (key) {
    // ── Cover ───────────────────────────────────────────────────────────────
    case "cover":
      return (
        <ReportCover
          title={config.title}
          organization={config.organization}
          reportType={
            hasData && reportData.ai_generated
              ? "AI-Generated Analytics Report"
              : "Analytics Report"
          }
        />
      );

    // ── Executive Summary ────────────────────────────────────────────────────
    case "executive_summary":
      if (!hasData) {
        return (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary">Executive Summary</h2>
            <NotGeneratedBanner />
            <SkeletonBlock lines={4} />
          </div>
        );
      }
      return (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-text-primary">Executive Summary</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            {reportData.executive_summary}
          </p>
          {reportData.key_findings.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Key Findings
              </p>
              <ul className="space-y-2" role="list">
                {reportData.key_findings.map((finding, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400"
                      aria-hidden="true"
                    />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {reportData.ai_generated && (
            <p className="flex items-center gap-1.5 text-xs text-ai-500">
              <Brain className="h-3 w-3" aria-hidden="true" />
              Generated by Gemini AI · {new Date(reportData.generated_at).toLocaleString()}
            </p>
          )}
        </div>
      );

    // ── Metrics Overview ─────────────────────────────────────────────────────
    case "metrics_overview": {
      if (!hasData) {
        return (
          <div className="space-y-3">
            <NotGeneratedBanner />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-border-default bg-bg-muted p-4"
                >
                  <div className="mb-2 h-6 w-12 rounded bg-border-default" />
                  <div className="h-3 w-20 rounded bg-border-default" />
                </div>
              ))}
            </div>
          </div>
        );
      }

      const metrics: ReportMetric[] = [
        {
          label: "Total Responses",
          value: reportData.metrics.total_responses,
          trend: reportData.metrics.total_responses > 0 ? "up" : "neutral",
        },
        {
          label: "Completion Rate",
          value: reportData.metrics.completion_rate,
          trend: "up",
        },
        {
          label: "Drop-off Rate",
          value: reportData.metrics.drop_off_rate,
          trend: "down",
        },
        {
          label: "Questions",
          value: reportData.metrics.question_count,
          trend: "neutral",
        },
      ];
      return <ReportMetricsBlock metrics={metrics} title="" />;
    }

    // ── Charts & Analytics ────────────────────────────────────────────────────
    case "charts_analytics": {
      if (!config.includeCharts) {
        return (
          <p className="text-sm text-text-muted">
            Charts not included in this report configuration.
          </p>
        );
      }

      if (!hasData) {
        return (
          <div className="space-y-4">
            <NotGeneratedBanner />
            <SkeletonBlock lines={6} />
          </div>
        );
      }

      // Normalise response trend to { name, value } shape
      const trendData: ReportChartData[] = reportData.chart_data.response_trend.map(
        (p, i) => ({
          name: p.date ? new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : `Point ${i + 1}`,
          value: p.count ?? p.value ?? 0,
        }),
      );

      // Question engagement bar chart
      const engagementData: ReportChartData[] = reportData.chart_data.question_engagement
        .slice(0, 8)
        .map((q, i) => ({
          name: `Q${i + 1}`,
          value: q.engagement_rate,
        }));

      return (
        <div className="space-y-6">
          {trendData.length > 0 ? (
            <ReportChartBlock
              title="Response Trend"
              description="Cumulative responses over time"
              data={trendData}
              chartType="line"
              height={200}
            />
          ) : (
            <p className="text-sm text-text-muted">
              No response trend data available yet.
            </p>
          )}
          {engagementData.length > 0 && (
            <ReportChartBlock
              title="Question Engagement"
              description="Percentage of respondents who answered each question"
              data={engagementData}
              chartType="bar"
              height={200}
            />
          )}
        </div>
      );
    }

    // ── AI Insights ───────────────────────────────────────────────────────────
    case "ai_insights":
      if (!config.includeAiInsights) {
        return (
          <div className="rounded-xl border border-border-soft bg-bg-muted p-5 text-sm text-text-muted">
            AI insights are disabled. Enable "Include AI Insights" in the configuration
            to add AI-generated analysis.
          </div>
        );
      }
      if (!hasData) {
        return (
          <div className="space-y-3">
            <NotGeneratedBanner />
            <SkeletonBlock lines={5} />
          </div>
        );
      }
      return reportData.ai_insights.length > 0 ? (
        <ReportInsightBlock insights={reportData.ai_insights} title="" />
      ) : (
        <p className="text-sm text-text-muted">
          No AI insights generated yet. Run the AI analytics for this survey first.
        </p>
      );

    // ── Sentiment Analysis ────────────────────────────────────────────────────
    case "sentiment_analysis": {
      if (!hasData) {
        return (
          <div className="space-y-3">
            <NotGeneratedBanner />
            <SkeletonBlock lines={4} />
          </div>
        );
      }

      const sentimentChart = reportData.chart_data.sentiment_distribution.filter(
        (d) => d.value > 0,
      );

      return (
        <div className="space-y-4">
          {sentimentChart.length > 0 ? (
            <ReportChartBlock
              title="Sentiment Distribution"
              description="Respondent sentiment across open-text answers"
              data={sentimentChart}
              chartType="pie"
              height={220}
            />
          ) : (
            <p className="text-sm text-text-muted">
              No sentiment data available — run AI sentiment analysis for this survey first.
            </p>
          )}
          {reportData.sentiment.reasoning && (
            <div className="rounded-xl border border-ai-200 bg-ai-50 p-4 dark:border-ai-700/30 dark:bg-ai-900/10">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ai-600">
                AI Sentiment Summary
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">
                {reportData.sentiment.reasoning}
              </p>
            </div>
          )}
        </div>
      );
    }

    // ── Question Breakdown ────────────────────────────────────────────────────
    case "question_breakdown": {
      if (!hasData) {
        return (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary">Question Breakdown</h2>
            <NotGeneratedBanner />
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-border-soft bg-bg-tertiary p-4"
              >
                <div className="mb-2 h-3 w-3/4 rounded bg-border-default" />
                <div className="h-2 rounded-full bg-border-default" />
              </div>
            ))}
          </div>
        );
      }

      const questions = reportData.question_breakdown;

      return (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-text-primary">Question Breakdown</h2>
          {questions.length === 0 ? (
            <p className="text-sm text-text-muted">
              No per-question data available yet.
            </p>
          ) : (
            questions.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-border-soft bg-bg-tertiary p-4"
              >
                <p className="mb-2 text-sm font-medium text-text-primary">
                  Q{i + 1}. {item.question_text}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="h-2 flex-1 overflow-hidden rounded-full bg-border-default"
                    role="progressbar"
                    aria-valuenow={item.engagement_rate}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${Math.min(item.engagement_rate, 100)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs font-semibold text-text-secondary">
                    {item.engagement_rate}%
                  </span>
                </div>
                {item.answer_count > 0 && (
                  <p className="mt-1 text-xs text-text-muted">
                    {item.answer_count} answer{item.answer_count !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      );
    }

    // ── Conclusions ───────────────────────────────────────────────────────────
    case "conclusions":
      if (!hasData) {
        return (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary">Conclusions</h2>
            <NotGeneratedBanner />
            <SkeletonBlock lines={3} />
          </div>
        );
      }
      return (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-text-primary">Conclusions</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            {reportData.conclusions}
          </p>
          {reportData.data_quality !== "unknown" && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border-default px-3 py-1 text-xs font-medium text-text-secondary">
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  reportData.data_quality === "high"
                    ? "bg-success"
                    : reportData.data_quality === "medium"
                    ? "bg-warning"
                    : "bg-danger",
                ].join(" ")}
                aria-hidden="true"
              />
              Data quality: {reportData.data_quality}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

// ─── Root component ───────────────────────────────────────────────────────────

export function ReportLayout({ config, totalPages, reportData }: ReportLayoutProps) {
  const sections = config.sections;
  const total    = totalPages ?? sections.length;

  return (
    <div className="flex flex-col gap-6" aria-label="Report layout" role="document">
      {sections.map((key, idx) => (
        <SectionWrapper
          key={key}
          sectionKey={key}
          config={config}
          pageNumber={idx + 1}
          totalPages={total}
        >
          {renderSection(key, config, reportData)}
        </SectionWrapper>
      ))}
    </div>
  );
}
