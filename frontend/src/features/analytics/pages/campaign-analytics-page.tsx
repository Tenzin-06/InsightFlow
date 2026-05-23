import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, MousePointerClick, Send, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { AnalyticsShell } from "@/features/analytics/components/layouts/analytics-shell";
import { AnalyticsGrid } from "@/features/analytics/components/layouts/analytics-grid";
import { AnalyticsDashboardHeader } from "@/features/analytics/components/layouts/dashboard-header";
import { StatGrid } from "@/features/analytics/components/metrics/stat-grid";
import { AnalyticsCard } from "@/features/analytics/components/widgets/analytics-card";
import { AnalyticsLineChart } from "@/features/analytics/components/charts/line-chart";
import { AnalyticsBarChart } from "@/features/analytics/components/charts/bar-chart";
import { PercentageCard } from "@/features/analytics/components/metrics/percentage-card";
import { MOCK_CAMPAIGN_ANALYTICS, CHART_COLORS } from "@/features/analytics/constants";
import type { MetricCardData } from "@/features/analytics/types";

export default function CampaignAnalyticsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const data = MOCK_CAMPAIGN_ANALYTICS;

  const kpiMetrics: MetricCardData[] = [
    {
      label: "Emails Sent",
      value: data.sentCount,
      icon: Send,
      description: "total recipients",
    },
    {
      label: "Open Rate",
      value: `${data.openRate}%`,
      change: "+5.3%",
      trend: "up",
      icon: Mail,
      description: "vs. industry avg",
    },
    {
      label: "Click Rate",
      value: `${data.clickRate}%`,
      change: "+2.1%",
      trend: "up",
      icon: MousePointerClick,
      description: "of opened emails",
    },
    {
      label: "Response Conversion",
      value: `${data.responseConversion}%`,
      change: "+8.4%",
      trend: "up",
      icon: TrendingUp,
      description: "sent → completed",
    },
  ];

  return (
    <PageContainer>
      <AnalyticsShell>
        {/* Back navigation */}
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1.5 text-text-secondary">
            <Link to="/analytics">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Overview
            </Link>
          </Button>
        </div>

        <AnalyticsDashboardHeader
          title={data.title}
          description={`Campaign analytics · ID: ${campaignId ?? data.campaignId}`}
        />

        {/* KPIs */}
        <StatGrid metrics={kpiMetrics} />

        {/* Rate summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <PercentageCard
            label="Open Rate"
            percentage={data.openRate}
            description="Recipients who opened the survey email"
            color={CHART_COLORS.primary}
          />
          <PercentageCard
            label="Click Rate"
            percentage={data.clickRate}
            description="Recipients who clicked the survey link"
            color={CHART_COLORS.secondary}
          />
          <PercentageCard
            label="Conversion Rate"
            percentage={data.responseConversion}
            description="Recipients who completed the survey"
            color={CHART_COLORS.success}
          />
        </div>

        {/* Open trend + reminder performance */}
        <AnalyticsGrid>
          <AnalyticsCard
            title="Open & Click Trend"
            description="Daily email opens and clicks after send"
            footer="Opens shown solid · Clicks shown dashed"
          >
            <AnalyticsLineChart
              data={data.openTrend}
              primaryLabel="Opens"
              secondaryLabel="Clicks"
              height={250}
            />
          </AnalyticsCard>

          <AnalyticsCard
            title="Reminder Performance"
            description="Responses attributed to each send/reminder"
          >
            <AnalyticsBarChart
              data={data.reminderPerformance}
              label="Responses"
              useItemColors
              height={250}
            />
          </AnalyticsCard>
        </AnalyticsGrid>
      </AnalyticsShell>
    </PageContainer>
  );
}
