import { ReportHeader } from "./report-header";
import { ReportFooter } from "./report-footer";
import { ReportCover } from "./report-cover";
import { ReportMetricsBlock } from "./report-metrics-block";
import { ReportChartBlock } from "./report-chart-block";
import { ReportInsightBlock } from "./report-insight-block";
import {
  REPORT_SECTION_LABELS,
  MOCK_REPORT_METRICS,
  MOCK_CHART_DATA,
  MOCK_SENTIMENT_DATA,
  MOCK_REPORT_INSIGHTS,
} from "../constants";
import type { ReportConfig, ReportSectionKey } from "../types";

type ReportLayoutProps = {
  config: ReportConfig;
  currentPage?: number;
  totalPages?: number;
};

function SectionWrapper({
  children, sectionKey, config, pageNumber, totalPages,
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

function renderSection(key: ReportSectionKey, config: ReportConfig): React.ReactNode {
  switch (key) {
    case "cover":
      return <ReportCover title={config.title} organization={config.organization} reportType="Analytics Report" />;

    case "executive_summary":
      return (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-text-primary">Executive Summary</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            This report summarizes survey analytics collected over the selected reporting period.
            Key metrics, response trends, and AI-generated insights are presented to provide a
            comprehensive view of survey performance and respondent engagement.
          </p>
          <ul className="space-y-2 pt-1" role="list">
            {[
              "Total response volume exceeded targets by 18% in the reporting period.",
              "Completion rates remain above the platform average of 62%.",
              "Sentiment analysis indicates predominantly positive respondent attitudes.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      );

    case "metrics_overview":
      return <ReportMetricsBlock metrics={MOCK_REPORT_METRICS} title="" />;

    case "charts_analytics":
      return (
        <div className="space-y-6">
          {config.includeCharts ? (
            <>
              <ReportChartBlock title="Response Trend" description="Total responses over time" data={MOCK_CHART_DATA} chartType="line" height={200} />
              <ReportChartBlock title="Response Distribution" description="Responses by period" data={MOCK_CHART_DATA} chartType="bar" height={200} />
            </>
          ) : (
            <p className="text-sm text-text-muted">Charts not included in this report configuration.</p>
          )}
        </div>
      );

    case "ai_insights":
      return config.includeAiInsights ? (
        <ReportInsightBlock insights={MOCK_REPORT_INSIGHTS} title="" />
      ) : (
        <div className="rounded-xl border border-border-soft bg-bg-muted p-5 text-sm text-text-muted">
          AI insights are disabled. Enable "Include AI Insights" in configuration to add AI-generated analysis.
        </div>
      );

    case "sentiment_analysis":
      return (
        <ReportChartBlock
          title="Sentiment Distribution"
          description="Respondent sentiment across open-text answers"
          data={MOCK_SENTIMENT_DATA}
          chartType="pie"
          height={220}
        />
      );

    case "question_breakdown":
      return (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-text-primary">Question Breakdown</h2>
          {[
            { q: "How satisfied are you with the overall experience?", rate: 84 },
            { q: "Would you recommend our service to others?", rate: 91 },
            { q: "What improvements would you suggest?", rate: 67 },
            { q: "How likely are you to participate again?", rate: 76 },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border-soft bg-bg-tertiary p-4">
              <p className="mb-2 text-sm font-medium text-text-primary">Q{i + 1}. {item.q}</p>
              <div className="flex items-center gap-3">
                <div
                  className="h-2 flex-1 overflow-hidden rounded-full bg-border-default"
                  role="progressbar"
                  aria-valuenow={item.rate}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${item.rate}%` }} />
                </div>
                <span className="w-10 text-right text-xs font-semibold text-text-secondary">{item.rate}%</span>
              </div>
            </div>
          ))}
        </div>
      );

    case "conclusions":
      return (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-text-primary">Conclusions</h2>
          <p className="text-sm leading-relaxed text-text-secondary">
            The survey data collected during this period demonstrates strong respondent engagement
            and a positive overall experience. Completion rates and response volumes are in line
            with project objectives.
          </p>
          <p className="text-sm leading-relaxed text-text-secondary">
            Areas for improvement have been identified through AI analysis and question breakdown
            review. Recommendations are included in the AI Insights section for follow-up action planning.
          </p>
        </div>
      );

    default:
      return null;
  }
}

export function ReportLayout({ config, totalPages }: ReportLayoutProps) {
  const sections = config.sections;
  const total = totalPages ?? sections.length;

  return (
    <div className="flex flex-col gap-6" aria-label="Report layout" role="document">
      {sections.map((key, idx) => (
        <SectionWrapper key={key} sectionKey={key} config={config} pageNumber={idx + 1} totalPages={total}>
          {renderSection(key, config)}
        </SectionWrapper>
      ))}
    </div>
  );
}
