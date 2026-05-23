import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckSquare, Clock, TrendingDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { AnalyticsShell } from "@/features/analytics/components/layouts/analytics-shell";
import { AnalyticsGrid } from "@/features/analytics/components/layouts/analytics-grid";
import { AnalyticsDashboardHeader } from "@/features/analytics/components/layouts/dashboard-header";
import { StatGrid } from "@/features/analytics/components/metrics/stat-grid";
import { AnalyticsCard } from "@/features/analytics/components/widgets/analytics-card";
import { AnalyticsTrendChart } from "@/features/analytics/components/charts/trend-chart";
import { AnalyticsBarChart } from "@/features/analytics/components/charts/bar-chart";
import { AnalyticsFunnelChart } from "@/features/analytics/components/charts/funnel-chart";
import { MOCK_SURVEY_ANALYTICS } from "@/features/analytics/constants";
import type { MetricCardData } from "@/features/analytics/types";

export default function SurveyAnalyticsPage() {
  const { surveyId } = useParams<{ surveyId: string }>();

  // In a real implementation this would fetch survey-specific data.
  // For now we use mock data (Unit 29 scope: UI only).
  const data = MOCK_SURVEY_ANALYTICS;

  const kpiMetrics: MetricCardData[] = [
    {
      label: "Total Responses",
      value: data.totalResponses,
      change: "+22%",
      trend: "up",
      icon: Users,
      description: "vs. previous period",
    },
    {
      label: "Completion Rate",
      value: `${data.completionRate}%`,
      change: "+3.5%",
      trend: "up",
      icon: CheckSquare,
      description: "of started surveys",
    },
    {
      label: "Avg. Completion Time",
      value: data.avgCompletionTime,
      icon: Clock,
      description: "per respondent",
    },
    {
      label: "Drop-Off Rate",
      value: `${data.dropOffRate}%`,
      change: "−3.5%",
      trend: "up",
      icon: TrendingDown,
      description: "improvement",
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
          description={`Survey analytics · ID: ${surveyId ?? data.surveyId}`}
        />

        {/* KPIs */}
        <StatGrid metrics={kpiMetrics} />

        {/* Response trend + completion funnel */}
        <AnalyticsGrid>
          <AnalyticsCard
            title="Response Trend"
            description="Weekly response volume over the survey's active period"
          >
            <AnalyticsTrendChart
              data={data.responseTrend}
              label="Responses"
              height={250}
            />
          </AnalyticsCard>

          <AnalyticsCard
            title="Completion Funnel"
            description="Drop-off analysis from survey open to submission"
          >
            <AnalyticsFunnelChart data={data.completionFunnel} />
          </AnalyticsCard>
        </AnalyticsGrid>

        {/* Question engagement */}
        <AnalyticsCard
          title="Question Engagement"
          description="Percentage of respondents who answered each question"
          footer="Lower values indicate drop-off at that question"
        >
          <AnalyticsBarChart
            data={data.questionEngagement}
            label="% Answered"
            yFormatter={(v) => `${v}%`}
            useItemColors
            height={240}
          />
        </AnalyticsCard>
      </AnalyticsShell>
    </PageContainer>
  );
}
