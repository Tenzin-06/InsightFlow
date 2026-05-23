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
import { MOCK_ENGAGEMENT } from "@/features/analytics/constants";

const data = MOCK_ENGAGEMENT;

export default function EngagementAnalyticsPage() {
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
          title="Engagement Analytics"
          description="Respondent lifecycle tracking, drop-off analysis, and interaction patterns."
        />

        {/* Engagement funnel + drop-off */}
        <AnalyticsGrid>
          <AnalyticsCard
            title="Engagement Funnel"
            description="Respondent journey from email send to survey completion"
          >
            <AnalyticsFunnelChart data={data.engagementFunnel} />
          </AnalyticsCard>

          <AnalyticsCard
            title="Drop-Off Points"
            description="Where respondents abandon the survey"
          >
            <AnalyticsBarChart
              data={data.dropOffPoints}
              label="Drop-offs"
              useItemColors
              height={250}
            />
          </AnalyticsCard>
        </AnalyticsGrid>

        {/* Interaction timeline + segment breakdown */}
        <AnalyticsGrid>
          <AnalyticsCard
            title="Interaction Timeline"
            description="Survey interactions by day of the week"
            footer="Higher activity on weekdays — optimal send times: Tuesday–Thursday"
          >
            <AnalyticsTrendChart
              data={data.interactionTimeline}
              label="Interactions"
              height={230}
            />
          </AnalyticsCard>

          <AnalyticsCard
            title="Audience Segment Breakdown"
            description="Response distribution across respondent categories"
          >
            <AnalyticsPieChart
              data={data.segmentBreakdown}
              height={250}
              innerRadius={60}
              outerRadius={95}
            />
          </AnalyticsCard>
        </AnalyticsGrid>
      </AnalyticsShell>
    </PageContainer>
  );
}
