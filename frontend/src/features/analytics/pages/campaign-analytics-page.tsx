import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Send, TrendingUp, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { AnalyticsShell } from "@/features/analytics/components/layouts/analytics-shell";
import { AnalyticsDashboardHeader } from "@/features/analytics/components/layouts/dashboard-header";
import { StatGrid } from "@/features/analytics/components/metrics/stat-grid";
import { AnalyticsCard } from "@/features/analytics/components/widgets/analytics-card";
import { AnalyticsTrendChart } from "@/features/analytics/components/charts/trend-chart";
import { AnalyticsFunnelChart } from "@/features/analytics/components/charts/funnel-chart";
import { PercentageCard } from "@/features/analytics/components/metrics/percentage-card";
import { AnalyticsSkeleton } from "@/features/analytics/components/states/analytics-skeleton";
import { useCampaignAnalytics } from "@/features/analytics/hooks/use-analytics";
import { CHART_COLORS } from "@/features/analytics/constants";
import type { MetricCardData } from "@/features/analytics/types";

export default function CampaignAnalyticsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { data, isPending, isFetching, isError, refetch } = useCampaignAnalytics(campaignId);

  if (isPending && isFetching) {
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
          <div>
            <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1.5 text-text-secondary">
              <Link to="/analytics"><ArrowLeft className="h-4 w-4" />Back to Overview</Link>
            </Button>
          </div>
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-sm font-semibold text-text-primary">Failed to load campaign analytics</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>Retry</Button>
          </div>
        </AnalyticsShell>
      </PageContainer>
    );
  }

  const m = data.metrics;

  const kpiMetrics: MetricCardData[] = [
    {
      label: "Emails Sent",
      value: m.emails_sent,
      icon: Send,
      description: "successfully delivered",
    },
    {
      label: "Emails Failed",
      value: m.emails_failed,
      icon: XCircle,
      description: "delivery failures",
    },
    {
      label: "Delivery Rate",
      value: `${m.delivery_rate.toFixed(1)}%`,
      icon: Mail,
      description: "of attempted sends",
    },
    {
      label: "Response Rate",
      value: `${m.response_rate.toFixed(1)}%`,
      icon: TrendingUp,
      description: "sent → survey completed",
    },
  ];

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
          title={`Campaign #${campaignId ?? ""}`}
          description="Email delivery and survey response analytics for this campaign."
        />

        {/* KPIs */}
        <StatGrid metrics={kpiMetrics} />

        {/* Rate summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <PercentageCard
            label="Delivery Rate"
            percentage={m.delivery_rate}
            description="Emails successfully delivered"
            color={CHART_COLORS.primary}
          />
          <PercentageCard
            label="Response Rate"
            percentage={m.response_rate}
            description="Recipients who completed the survey"
            color={CHART_COLORS.secondary}
          />
          <PercentageCard
            label="Failure Rate"
            percentage={m.emails_sent > 0
              ? Math.round((m.emails_failed / (m.emails_sent + m.emails_failed)) * 100)
              : 0}
            description="Emails that failed to deliver"
            color={CHART_COLORS.danger}
          />
        </div>

        {/* Delivery trend + funnel */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AnalyticsCard
            title="Delivery Trend"
            description="Emails sent per day over the last 30 days"
          >
            {data.charts.delivery_trend.length > 0 ? (
              <AnalyticsTrendChart
                data={data.charts.delivery_trend}
                label="Emails Sent"
                height={250}
              />
            ) : (
              <p className="py-16 text-center text-sm text-text-muted">No delivery data yet.</p>
            )}
          </AnalyticsCard>

          <AnalyticsCard
            title="Campaign Funnel"
            description="From attempted delivery to survey response"
          >
            {data.funnel.length > 0 ? (
              <AnalyticsFunnelChart data={data.funnel} />
            ) : (
              <p className="py-16 text-center text-sm text-text-muted">
                No emails sent yet — activate the campaign to see the funnel.
              </p>
            )}
          </AnalyticsCard>
        </div>
      </AnalyticsShell>
    </PageContainer>
  );
}
