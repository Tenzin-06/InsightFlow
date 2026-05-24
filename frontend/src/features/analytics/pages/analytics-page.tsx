import { BarChart3, Mail, TrendingUp, Users } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { AnalyticsShell } from "@/features/analytics/components/layouts/analytics-shell";
import { AnalyticsGrid } from "@/features/analytics/components/layouts/analytics-grid";
import { AnalyticsDashboardHeader } from "@/features/analytics/components/layouts/dashboard-header";
import { StatGrid } from "@/features/analytics/components/metrics/stat-grid";
import { AnalyticsCard } from "@/features/analytics/components/widgets/analytics-card";
import { AnalyticsTrendChart } from "@/features/analytics/components/charts/trend-chart";
import { AnalyticsBarChart } from "@/features/analytics/components/charts/bar-chart";
import { AnalyticsSkeleton } from "@/features/analytics/components/states/analytics-skeleton";
import { useDashboardAnalytics } from "@/features/analytics/hooks/use-analytics";
import { Button } from "@/components/ui/button";
import type { MetricCardData, CategoryPoint } from "@/features/analytics/types";

export default function AnalyticsPage() {
  const { data, isLoading, isError, refetch } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <PageContainer>
        <AnalyticsShell>
          <AnalyticsSkeleton />
        </AnalyticsShell>
      </PageContainer>
    );
  }

  if (isError || !data) {
    return (
      <PageContainer>
        <AnalyticsShell>
          <AnalyticsDashboardHeader
            title="Analytics Overview"
            description="Survey performance, campaign engagement, and response metrics at a glance."
          />
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-sm font-semibold text-text-primary">Failed to load analytics</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>Retry</Button>
          </div>
        </AnalyticsShell>
      </PageContainer>
    );
  }

  const m = data.metrics;

  const kpiMetrics: MetricCardData[] = [
    {
      label: "Total Responses",
      value: m.total_responses,
      icon: BarChart3,
      description: "across all surveys",
    },
    {
      label: "Total Surveys",
      value: m.total_surveys,
      icon: Users,
      description: "created by you",
    },
    {
      label: "Campaigns",
      value: m.total_campaigns,
      icon: Mail,
      description: "email campaigns",
    },
    {
      label: "Response Rate",
      value: `${m.overall_response_rate.toFixed(1)}%`,
      icon: TrendingUp,
      description: "emails → responses",
    },
  ];

  const topSurveysData: CategoryPoint[] = data.charts.top_surveys.map((s) => ({
    name: s.title.length > 22 ? s.title.slice(0, 22) + "…" : s.title,
    value: s.response_count,
  }));

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
            description="Total responses collected over the last 30 days"
            footer="Updated from your survey responses"
          >
            {data.charts.response_trend.length > 0 ? (
              <AnalyticsTrendChart
                data={data.charts.response_trend}
                label="Responses"
                height={260}
              />
            ) : (
              <p className="py-16 text-center text-sm text-text-muted">
                No responses yet — share your surveys to start collecting data.
              </p>
            )}
          </AnalyticsCard>

          <AnalyticsCard
            title="Top Performing Surveys"
            description="Surveys ranked by total response count"
            footer="All-time response data"
          >
            {topSurveysData.length > 0 ? (
              <AnalyticsBarChart
                data={topSurveysData}
                label="Responses"
                height={260}
              />
            ) : (
              <p className="py-16 text-center text-sm text-text-muted">
                No survey responses yet.
              </p>
            )}
          </AnalyticsCard>
        </AnalyticsGrid>

        {/* Insight spotlight */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm dark:bg-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                <Mail className="h-5 w-5 text-primary-500" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium text-text-secondary">Emails Sent</p>
                <p className="text-2xl font-extrabold text-text-primary">
                  {m.total_emails_sent}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-muted">
              Total emails distributed across all campaigns
            </p>
          </div>

          <div className="rounded-xl border border-border-default bg-primary-50 p-5 sm:col-span-2 dark:bg-primary-900/10">
            <p className="text-sm font-semibold text-primary-800 dark:text-primary-300">
              Quick Insights
            </p>
            <ul className="mt-3 space-y-2" role="list">
              {[
                m.total_surveys === 0
                  ? "Create your first survey to start collecting responses."
                  : `You have ${m.total_surveys} survey${m.total_surveys !== 1 ? "s" : ""} collecting responses.`,
                m.total_responses === 0
                  ? "Share your surveys to start receiving responses."
                  : `${m.total_responses} total response${m.total_responses !== 1 ? "s" : ""} collected across all surveys.`,
                m.overall_response_rate > 0
                  ? `Overall response rate: ${m.overall_response_rate.toFixed(1)}% of emails → completed surveys.`
                  : "No email campaigns sent yet — create a campaign to track response rates.",
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
