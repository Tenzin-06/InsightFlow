import { BarChart3, CheckSquare, Mail, TrendingDown, MousePointerClick } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { AnalyticsShell } from "@/features/analytics/components/layouts/analytics-shell";
import { AnalyticsGrid } from "@/features/analytics/components/layouts/analytics-grid";
import { AnalyticsDashboardHeader } from "@/features/analytics/components/layouts/dashboard-header";
import { StatGrid } from "@/features/analytics/components/metrics/stat-grid";
import { AnalyticsCard } from "@/features/analytics/components/widgets/analytics-card";
import { AnalyticsTrendChart } from "@/features/analytics/components/charts/trend-chart";
import { AnalyticsBarChart } from "@/features/analytics/components/charts/bar-chart";
import { MOCK_DASHBOARD_OVERVIEW } from "@/features/analytics/constants";
import type { MetricCardData, CategoryPoint } from "@/features/analytics/types";

const overview = MOCK_DASHBOARD_OVERVIEW;

const kpiMetrics: MetricCardData[] = [
  {
    label: "Total Responses",
    value: overview.totalResponses,
    change: "+18%",
    trend: "up",
    icon: BarChart3,
    description: "vs. last month",
  },
  {
    label: "Completion Rate",
    value: `${overview.completionRate}%`,
    change: "+4.2%",
    trend: "up",
    icon: CheckSquare,
    description: "avg. across surveys",
  },
  {
    label: "Open Rate",
    value: `${overview.openRate}%`,
    change: "+1.8%",
    trend: "up",
    icon: Mail,
    description: "email campaigns",
  },
  {
    label: "Drop-Off Rate",
    value: `${overview.dropOffRate}%`,
    change: "−2.1%",
    trend: "up",
    icon: TrendingDown,
    description: "improvement",
  },
];

const topSurveysData: CategoryPoint[] = overview.topSurveys.map((s) => ({
  name: s.title.length > 22 ? s.title.slice(0, 22) + "…" : s.title,
  value: s.responses,
}));

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <AnalyticsShell>
        <AnalyticsDashboardHeader
          title="Analytics Overview"
          description="Survey performance, campaign engagement, and response metrics at a glance."
        />

        {/* KPI metrics */}
        <StatGrid metrics={kpiMetrics} />

        {/* Primary charts */}
        <AnalyticsGrid>
          <AnalyticsCard
            title="Response Trend"
            description="Total responses collected over time"
            footer="Based on all surveys in the last 8 months"
          >
            <AnalyticsTrendChart
              data={overview.responseTrend}
              label="Responses"
              height={260}
            />
          </AnalyticsCard>

          <AnalyticsCard
            title="Top Performing Surveys"
            description="Surveys ranked by total response count"
            footer="All-time response data"
          >
            <AnalyticsBarChart
              data={topSurveysData}
              label="Responses"
              height={260}
            />
          </AnalyticsCard>
        </AnalyticsGrid>

        {/* Insight spotlight row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm dark:bg-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                <MousePointerClick className="h-5 w-5 text-primary-500" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium text-text-secondary">Click Rate</p>
                <p className="text-2xl font-extrabold text-text-primary">
                  {overview.clickRate}%
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-muted">
              Across all active distribution campaigns
            </p>
          </div>

          <div className="rounded-xl border border-border-default bg-primary-50 p-5 sm:col-span-2 dark:bg-primary-900/10">
            <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">
              Quick Insights
            </p>
            <ul className="mt-3 space-y-2" role="list">
              {[
                "Completion rates have improved by 4.2% compared to last month.",
                "Drop-off rates are declining — survey design improvements are working.",
                "Top 5 surveys account for 83% of total responses.",
              ].map((insight) => (
                <li
                  key={insight}
                  className="flex items-start gap-2 text-xs text-primary-700 dark:text-primary-400"
                >
                  <span
                    className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400"
                    aria-hidden="true"
                  />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnalyticsShell>
    </PageContainer>
  );
}
