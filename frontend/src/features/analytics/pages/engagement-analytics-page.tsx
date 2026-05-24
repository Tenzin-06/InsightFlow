import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { AnalyticsShell } from "@/features/analytics/components/layouts/analytics-shell";
import { AnalyticsGrid } from "@/features/analytics/components/layouts/analytics-grid";
import { AnalyticsDashboardHeader } from "@/features/analytics/components/layouts/dashboard-header";
import { AnalyticsCard } from "@/features/analytics/components/widgets/analytics-card";
import { AnalyticsFunnelChart } from "@/features/analytics/components/charts/funnel-chart";
import { AnalyticsBarChart } from "@/features/analytics/components/charts/bar-chart";
import { AnalyticsPieChart } from "@/features/analytics/components/charts/pie-chart";
import { AnalyticsTrendChart } from "@/features/analytics/components/charts/trend-chart";
import { AnalyticsSkeleton } from "@/features/analytics/components/states/analytics-skeleton";
import { useEngagementAnalytics } from "@/features/analytics/hooks/use-analytics";
import { CHART_COLORS } from "@/features/analytics/constants";

export default function EngagementAnalyticsPage() {
  const { data, isLoading, isError, refetch } = useEngagementAnalytics();

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
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-sm font-semibold text-text-primary">Failed to load engagement analytics</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>Retry</Button>
          </div>
        </AnalyticsShell>
      </PageContainer>
    );
  }

  // Map drop-off data: show per-survey response rates as bar chart
  const dropOffBars = data.charts.drop_off.map((s, i) => ({
    name: s.title.length > 22 ? s.title.slice(0, 22) + "…" : s.title,
    value: s.response_rate,
    fill: [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning,
           CHART_COLORS.purple, CHART_COLORS.danger][i % 5],
  }));

  // Map segments: backend uses "label", charts expect "name"
  const segmentPie = data.charts.segments.map((s) => ({
    name: s.label,
    value: s.value,
    fill: s.fill ?? undefined,
  }));

  // Show helpful empty states when user has no data yet
  const hasFunnel = data.funnel.length > 0;
  const hasDropOff = dropOffBars.length > 0;
  const hasTimeline = data.charts.timeline.length > 0;
  const hasSegments = segmentPie.length > 0;

  return (
    <PageContainer>
      <AnalyticsShell>
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1.5 text-text-secondary">
            <Link to="/analytics">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Overview
            </Link>
          </Button>
        </div>

        <AnalyticsDashboardHeader
          title="Engagement Analytics"
          description="Respondent lifecycle tracking, drop-off analysis, and interaction patterns."
        />

        {/* Engagement funnel + drop-off */}
        <AnalyticsGrid>
          <AnalyticsCard
            title="Engagement Funnel"
            description="Respondent journey from email send to survey completion"
          >
            {hasFunnel ? (
              <AnalyticsFunnelChart data={data.funnel} />
            ) : (
              <p className="py-16 text-center text-sm text-text-muted">
                No campaign data yet — send a campaign to see the funnel.
              </p>
            )}
          </AnalyticsCard>

          <AnalyticsCard
            title="Survey Response Rates"
            description="Response rate per survey (higher = better engagement)"
          >
            {hasDropOff ? (
              <AnalyticsBarChart
                data={dropOffBars}
                label="Response Rate %"
                yFormatter={(v) => `${v}%`}
                useItemColors
                height={250}
              />
            ) : (
              <p className="py-16 text-center text-sm text-text-muted">
                No survey response data yet.
              </p>
            )}
          </AnalyticsCard>
        </AnalyticsGrid>

        {/* Interaction timeline + segment breakdown */}
        <AnalyticsGrid>
          <AnalyticsCard
            title="Interaction Timeline"
            description="Survey responses collected over time"
            footer="Based on the last 30 days of response activity"
          >
            {hasTimeline ? (
              <AnalyticsTrendChart
                data={data.charts.timeline}
                label="Responses"
                height={230}
              />
            ) : (
              <p className="py-16 text-center text-sm text-text-muted">
                No response activity in the last 30 days.
              </p>
            )}
          </AnalyticsCard>

          <AnalyticsCard
            title="Campaign Distribution"
            description="Emails sent per campaign"
          >
            {hasSegments ? (
              <AnalyticsPieChart
                data={segmentPie}
                height={250}
                innerRadius={60}
                outerRadius={95}
              />
            ) : (
              <p className="py-16 text-center text-sm text-text-muted">
                No email campaigns with deliveries yet.
              </p>
            )}
          </AnalyticsCard>
        </AnalyticsGrid>
      </AnalyticsShell>
    </PageContainer>
  );
}
