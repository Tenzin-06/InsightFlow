import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckSquare, HelpCircle, LineChart, TrendingDown, Users } from "lucide-react";
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
import { AnalyticsSkeleton } from "@/features/analytics/components/states/analytics-skeleton";
import { useSurveyAnalytics } from "@/features/analytics/hooks/use-analytics";
import { useSurveys } from "@/features/surveys/hooks/use-surveys";
import { CHART_COLORS } from "@/features/analytics/constants";
import type { MetricCardData } from "@/features/analytics/types";

// ---------------------------------------------------------------------------
// Survey picker — shown when navigating to /dashboard/analytics/surveys
// without a survey ID in the URL.
// ---------------------------------------------------------------------------

function SurveyPicker() {
  const { data: surveys = [], isLoading } = useSurveys();

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
          title="Survey Analytics"
          description="Select a survey below to explore its response trends, completion funnel, and question engagement."
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-muted" />
            ))}
          </div>
        ) : surveys.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <LineChart className="h-10 w-10 text-text-muted" aria-hidden="true" />
            <p className="text-sm font-semibold text-text-primary">No surveys yet</p>
            <p className="text-xs text-text-muted">
              Create and publish a survey first to start tracking analytics.
            </p>
            <Button asChild size="sm">
              <Link to="/surveys/create">Create Survey</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <Link
                key={survey.id}
                to={`/dashboard/analytics/surveys/${survey.id}`}
                className="group flex flex-col gap-1.5 rounded-xl border border-border-default bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-card"
              >
                <p className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors line-clamp-2">
                  {survey.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="capitalize">{survey.status}</span>
                  <span>·</span>
                  <span>{survey.response_count ?? 0} responses</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AnalyticsShell>
    </PageContainer>
  );
}

// ---------------------------------------------------------------------------
// Survey analytics detail view
// ---------------------------------------------------------------------------

export default function SurveyAnalyticsPage() {
  const { surveyId } = useParams<{ surveyId: string }>();

  // If no surveyId in URL, show the picker
  if (!surveyId) {
    return <SurveyPicker />;
  }

  return <SurveyAnalyticsDetail surveyId={surveyId} />;
}

function SurveyAnalyticsDetail({ surveyId }: { surveyId: string }) {
  const { data, isPending, isFetching, isError, error, refetch } = useSurveyAnalytics(surveyId);
  const { data: surveys = [] } = useSurveys();

  const survey = surveys.find((s) => String(s.id) === surveyId);
  const surveyTitle = survey?.title ?? `Survey #${surveyId}`;

  // Show skeleton while actively fetching (isPending = no data yet, isFetching = request in flight)
  if (isPending && isFetching) {
    return (
      <PageContainer>
        <AnalyticsShell>
          <AnalyticsSkeleton />
        </AnalyticsShell>
      </PageContainer>
    );
  }

  if (isError) {
    const apiError = error as { message?: string; status?: number } | null;
    const msg = apiError?.message ?? "Could not load analytics for this survey.";
    const status = apiError?.status;
    return (
      <PageContainer>
        <AnalyticsShell>
          <div>
            <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1.5 text-text-secondary">
              <Link to="/dashboard/analytics/surveys"><ArrowLeft className="h-4 w-4" />Back to Surveys</Link>
            </Button>
          </div>
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-sm font-semibold text-text-primary">
              {status === 404 ? "Survey not found" : status === 403 ? "Access denied" : "Failed to load analytics"}
            </p>
            <p className="text-xs text-text-muted max-w-xs">{msg}{status ? ` (${status})` : ""}</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>Retry</Button>
          </div>
        </AnalyticsShell>
      </PageContainer>
    );
  }

  // No data yet but not errored (e.g. query disabled) — show skeleton
  if (!data) {
    return (
      <PageContainer>
        <AnalyticsShell>
          <AnalyticsSkeleton />
        </AnalyticsShell>
      </PageContainer>
    );
  }

  const m = data.metrics;

  const kpiMetrics: MetricCardData[] = [
    {
      label: "Total Responses",
      value: m.total_responses,
      icon: Users,
      description: "survey submissions",
    },
    {
      label: "Completion Rate",
      value: `${m.completion_rate.toFixed(1)}%`,
      icon: CheckSquare,
      description: m.completion_rate > 0 ? "of emails sent" : "no campaigns yet",
    },
    {
      label: "Questions",
      value: m.question_count,
      icon: HelpCircle,
      description: "in this survey",
    },
    {
      label: "Drop-Off Rate",
      value: `${m.drop_off_rate.toFixed(1)}%`,
      icon: TrendingDown,
      description: m.drop_off_rate > 0 ? "did not respond" : "no campaign data",
    },
  ];

  // Map question engagement to bar chart format
  const questionEngagementBars = data.charts.question_engagement.map((q, i) => ({
    name: q.question_text.length > 28 ? q.question_text.slice(0, 28) + "…" : q.question_text,
    value: Math.round(q.engagement_rate),
    fill: [
      CHART_COLORS.primary,
      CHART_COLORS.secondary,
      CHART_COLORS.success,
      CHART_COLORS.warning,
      CHART_COLORS.purple,
    ][i % 5],
  }));

  return (
    <PageContainer>
      <AnalyticsShell>
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1.5 text-text-secondary">
            <Link to="/dashboard/analytics/surveys">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Surveys
            </Link>
          </Button>
        </div>

        <AnalyticsDashboardHeader
          title={surveyTitle}
          description={`Survey analytics · ID: ${surveyId}`}
        />

        {/* KPIs */}
        <StatGrid metrics={kpiMetrics} />

        {/* Response trend + completion funnel */}
        <AnalyticsGrid>
          <AnalyticsCard
            title="Response Trend"
            description="Responses collected over the last 30 days"
          >
            {data.charts.response_trend.length > 0 ? (
              <AnalyticsTrendChart
                data={data.charts.response_trend}
                label="Responses"
                height={250}
              />
            ) : (
              <p className="py-16 text-center text-sm text-text-muted">No responses yet.</p>
            )}
          </AnalyticsCard>

          <AnalyticsCard
            title="Completion Funnel"
            description="Journey from email send to survey submission"
          >
            {data.funnel.length > 0 ? (
              <AnalyticsFunnelChart data={data.funnel} />
            ) : (
              <p className="py-16 text-center text-sm text-text-muted">
                No campaign data — send a campaign to see the funnel.
              </p>
            )}
          </AnalyticsCard>
        </AnalyticsGrid>

        {/* Question engagement */}
        {questionEngagementBars.length > 0 && (
          <AnalyticsCard
            title="Question Engagement"
            description="Percentage of respondents who answered each question"
            footer="Lower values indicate drop-off at that question"
          >
            <AnalyticsBarChart
              data={questionEngagementBars}
              label="% Answered"
              yFormatter={(v) => `${v}%`}
              useItemColors
              height={240}
            />
          </AnalyticsCard>
        )}

        {questionEngagementBars.length === 0 && (
          <AnalyticsCard
            title="Question Engagement"
            description="Percentage of respondents who answered each question"
          >
            <p className="py-16 text-center text-sm text-text-muted">
              No question response data yet — collect some responses first.
            </p>
          </AnalyticsCard>
        )}
      </AnalyticsShell>
    </PageContainer>
  );
}
