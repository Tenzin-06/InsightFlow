import {
  BarChart3,
  FileText,
  Mail,
  Users,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Activity,
  FileBarChart2,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardAnalytics } from "@/features/analytics/hooks/use-analytics";
import { useSurveys } from "@/features/surveys/hooks/use-surveys";
import { SurveyStatusBadge } from "@/features/surveys/components/survey-status-badge";
import { cn } from "@/lib/utils";
import type { SurveyStatus } from "@/features/surveys/types";

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  to,
  accent,
  description,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  to?: string;
  accent: string;
  description?: string;
}) {
  const inner = (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-all hover:shadow-md",
      to && "cursor-pointer hover:border-[#9FC2FF]"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#475569]">{label}</p>
          <p className="mt-1.5 text-3xl font-bold text-[#0F172A]">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-[#94A3B8]">{description}</p>
          )}
        </div>
        <div className={cn("rounded-xl p-2.5", accent)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {to && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#3B82F6] opacity-0 transition-opacity group-hover:opacity-100">
          View details <ArrowRight className="h-3 w-3" />
        </div>
      )}
    </div>
  );
  return to ? <Link to={to} className="block">{inner}</Link> : inner;
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}

// ── Survey report row ─────────────────────────────────────────────────────────

function SurveyReportRow({
  id,
  title,
  status,
  response_count,
}: {
  id: string;
  title: string;
  status: SurveyStatus;
  response_count?: number | null;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-[#F8FAFC] transition-colors">
      {/* Icon + title */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF]">
          <FileText className="h-4 w-4 text-[#3B82F6]" />
        </div>
        <Link
          to={`/surveys/${id}`}
          className="truncate text-sm font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
        >
          {title}
        </Link>
      </div>

      {/* Status */}
      <div className="hidden shrink-0 sm:block">
        <SurveyStatusBadge status={status} />
      </div>

      {/* Responses */}
      <div className="hidden shrink-0 w-24 text-right sm:block">
        <span className="text-sm font-semibold text-[#0F172A]">
          {response_count ?? 0}
        </span>
        <span className="ml-1 text-xs text-[#94A3B8]">responses</span>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <Link
          to={`/analytics/survey/${id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs font-medium text-[#475569] transition-colors hover:border-[#3B82F6] hover:text-[#3B82F6]"
        >
          <BarChart3 className="h-3 w-3" />
          <span className="hidden sm:inline">Analytics</span>
        </Link>
        <Link
          to={`/reports?surveyId=${id}`}
          className="inline-flex items-center gap-1 rounded-lg bg-[#EEF4FF] px-2.5 py-1.5 text-xs font-medium text-[#3B82F6] transition-colors hover:bg-[#3B82F6] hover:text-white"
        >
          <FileBarChart2 className="h-3 w-3" />
          <span className="hidden sm:inline">Generate Report</span>
        </Link>
      </div>
    </div>
  );
}

// ── Top survey bar ─────────────────────────────────────────────────────────────

function TopSurveyBar({ title, count, max, rank }: { title: string; count: number; max: number; rank: number }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  const rankColors = ["#3B82F6", "#14B8A6", "#F97316", "#8B5CF6", "#EC4899"];
  const color = rankColors[rank] ?? "#94A3B8";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-xs text-[#475569]">{title}</p>
        <span className="shrink-0 text-xs font-semibold text-[#0F172A]">{count}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data, isLoading: analyticsLoading } = useDashboardAnalytics();
  const { data: surveys = [], isLoading: surveysLoading } = useSurveys();

  const sortedSurveys = [...surveys].sort(
    (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
  );
  const displaySurveys = sortedSurveys.slice(0, 8);

  const topSurveys = data?.charts?.top_surveys ?? [];
  const maxResponses = topSurveys.reduce((m, s) => Math.max(m, s.response_count), 0);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-7">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">{greeting} 👋</h1>
        <p className="mt-0.5 text-sm text-[#94A3B8]">{dateStr} · InsightFlow Dashboard</p>
      </div>

      {/* ── Key metrics ──────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Surveys"
              value={data?.metrics.total_surveys ?? 0}
              icon={FileText}
              to="/surveys"
              accent="bg-[#EEF4FF] text-[#3B82F6]"
              description="across all statuses"
            />
            <StatCard
              label="Total Responses"
              value={data?.metrics.total_responses ?? 0}
              icon={Users}
              to="/analytics"
              accent="bg-[#F0FDFA] text-[#14B8A6]"
              description="survey submissions"
            />
            <StatCard
              label="Campaigns"
              value={data?.metrics.total_campaigns ?? 0}
              icon={Mail}
              to="/dashboard/campaigns"
              accent="bg-[#FFF7ED] text-[#F97316]"
              description="email campaigns sent"
            />
            <StatCard
              label="Response Rate"
              value={`${(data?.metrics.overall_response_rate ?? 0).toFixed(1)}%`}
              icon={TrendingUp}
              to="/analytics"
              accent="bg-[#F0FDF4] text-[#22C55E]"
              description="emails → responses"
            />
          </>
        )}
      </div>

      {/* ── Survey Findings & Reports ─────────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Survey Findings & Reports</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Generate research reports for any survey — click "Generate Report" on a row.</p>
          </div>
          <Link
            to="/surveys"
            className="flex items-center gap-1 text-xs font-medium text-[#3B82F6] hover:text-[#2563EB]"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
          {/* Table header */}
          <div className="hidden items-center gap-4 border-b border-[#F1F5F9] bg-[#F8FAFC] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#94A3B8] sm:flex">
            <div className="flex-1">Survey</div>
            <div className="w-20 shrink-0">Status</div>
            <div className="w-24 shrink-0 text-right">Responses</div>
            <div className="w-44 shrink-0 text-right">Actions</div>
          </div>

          {surveysLoading ? (
            <div className="divide-y divide-[#F1F5F9]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-7 w-28 rounded-lg" />
                </div>
              ))}
            </div>
          ) : displaySurveys.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F5F9]">
                <Sparkles className="h-6 w-6 text-[#94A3B8]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">No surveys yet</p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">
                  Create a survey and collect responses — then generate a report with research findings here.
                </p>
              </div>
              <Link
                to="/surveys/create"
                className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-[#3B82F6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2563EB]"
              >
                Create your first survey
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {displaySurveys.map((s) => (
                <SurveyReportRow
                  key={s.id}
                  id={s.id}
                  title={s.title}
                  status={s.status}
                  response_count={s.response_count}
                />
              ))}
              {surveys.length > 8 && (
                <div className="px-4 py-3 text-center">
                  <Link
                    to="/surveys"
                    className="text-xs font-medium text-[#3B82F6] hover:text-[#2563EB]"
                  >
                    + {surveys.length - 8} more surveys — view all
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row ────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">

        {/* Platform Status */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-[#0F172A]">
            <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
            Platform Status
          </div>
          <p className="mt-2 text-xs text-[#94A3B8]">All systems operational</p>
          <div className="mt-3 space-y-1.5">
            {[["API", true], ["Analytics", true], ["Email", true]].map(([name, ok]) => (
              <div key={String(name)} className="flex items-center justify-between text-xs">
                <span className="text-[#475569]">{name}</span>
                <span className={cn("font-medium", ok ? "text-[#22C55E]" : "text-[#EF4444]")}>
                  {ok ? "Operational" : "Degraded"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-[#F1F5F9] pt-3">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-[#0F172A]">
              <Activity className="h-4 w-4 text-[#3B82F6]" />
              Published
            </div>
            {surveysLoading ? (
              <Skeleton className="mt-2 h-7 w-12" />
            ) : (
              <>
                <p className="mt-1 text-2xl font-bold text-[#0F172A]">
                  {surveys.filter((s) => s.status === "published").length}
                </p>
                <p className="text-xs text-[#94A3B8]">of {surveys.length} total surveys</p>
              </>
            )}
          </div>
        </div>

        {/* Top Surveys */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-[#0F172A]">
            <Trophy className="h-4 w-4 text-[#F97316]" />
            Top Surveys by Responses
          </div>
          <div className="mt-3 space-y-3">
            {analyticsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))
            ) : topSurveys.length === 0 ? (
              <p className="text-xs text-[#94A3B8] py-4 text-center">No responses yet</p>
            ) : (
              topSurveys.slice(0, 5).map((s, i) => (
                <TopSurveyBar
                  key={s.survey_id}
                  title={s.title}
                  count={s.response_count}
                  max={maxResponses}
                  rank={i}
                />
              ))
            )}
          </div>
          <Link
            to="/analytics"
            className="mt-4 flex items-center gap-1 text-xs font-medium text-[#3B82F6] hover:text-[#2563EB]"
          >
            Full analytics <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Reports CTA */}
        <div className="rounded-xl border border-[#C7DDFF] bg-[#EEF4FF] p-5 shadow-sm">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-[#1D4ED8]">
            <FileBarChart2 className="h-4 w-4" />
            Generate a Report
          </div>
          <p className="mt-2 text-xs text-[#475569] leading-relaxed">
            Turn survey responses into professional research reports — with metrics, charts, AI insights, and sentiment analysis.
          </p>
          <div className="mt-4 space-y-2">
            {surveysLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))
            ) : sortedSurveys.slice(0, 3).map((s) => (
              <Link
                key={s.id}
                to={`/reports?surveyId=${s.id}`}
                className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 text-xs font-medium text-[#1D4ED8] transition-colors hover:bg-white"
              >
                <span className="min-w-0 truncate">{s.title}</span>
                <div className="ml-2 flex shrink-0 items-center gap-1 text-[#3B82F6]">
                  <Clock className="h-3 w-3" />
                  <span>Report</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
            {sortedSurveys.length === 0 && (
              <p className="text-center text-xs text-[#475569] py-2">No surveys yet</p>
            )}
          </div>
          <Link
            to="/reports"
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] hover:text-[#2563EB]"
          >
            Open Reports Center <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
