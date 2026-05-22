import { Cpu, ScanSearch, FlaskConical, TrendingUp, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/features/marketing/components/scroll-reveal";

type AICapability = {
  icon: React.ElementType;
  title: string;
  description: string;
  number: string;
};

const capabilities: AICapability[] = [
  {
    number: "01",
    icon: Cpu,
    title: "AI-Assisted Optimization",
    description:
      "Intelligent suggestions refine question phrasing, survey flow, and response options to maximize data quality before you even launch.",
  },
  {
    number: "02",
    icon: ScanSearch,
    title: "Automated Engagement Analysis",
    description:
      "AI continuously monitors participation patterns, detecting fatigue signals and drop-off points so you can course-correct in real time.",
  },
  {
    number: "03",
    icon: FlaskConical,
    title: "Synthetic Response Simulation",
    description:
      "Simulate survey performance with AI-generated synthetic respondents before distributing — catch structural issues early.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Analytics Intelligence",
    description:
      "Beyond charts and numbers: AI interprets your response data and surfaces narrative summaries, outliers, and significance indicators.",
  },
];

const mockMetrics = [
  { label: "Avg. Completion Rate", value: "87%",    change: "+12%", positive: true },
  { label: "Response Quality",     value: "9.4",    change: "+0.8", positive: true },
  { label: "Avg. Time on Survey",  value: "4m 12s", change: "−18s", positive: true },
  { label: "AI Insights",          value: "1,240",  change: "+340", positive: true },
];

const barData = [42, 68, 55, 80, 95, 73, 88];
const days    = ["M", "T", "W", "T", "F", "S", "S"];
const maxBar  = Math.max(...barData);

export function AnalyticsSection() {
  return (
    <section
      id="analytics"
      className="bg-background py-16 sm:py-24"
      aria-labelledby="analytics-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── Left column ───────────────────────────────── */}
          <div>
            <ScrollReveal>
              <span className="mb-5 inline-block border-b-2 border-primary pb-1 text-base font-semibold text-primary">
                AI Intelligence
              </span>

              <h2
                id="analytics-heading"
                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
              >
                Research intelligence{" "}
                <span className="text-primary-500">powered by AI</span>
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-foreground">
                InsightFlow's AI layer works across every stage of your research — from survey
                design to final analysis — so that every decision is backed by data you can trust.
              </p>
            </ScrollReveal>

            {/* Capability rows */}
            <ul className="mt-10 flex flex-col" aria-label="AI capabilities">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <ScrollReveal key={cap.title} delay={i * 80} direction="left">
                    <li className="group border-t border-border py-5 last:border-b">
                      <div className="flex items-start gap-4">
                        {/* Number + icon */}
                        <div className="flex shrink-0 flex-col items-center gap-1 pt-0.5">
                          <span className="text-xs font-bold tabular-nums text-foreground">
                            {cap.number}
                          </span>
                          <Icon
                            className="h-6 w-6 text-primary-500 transition-transform duration-200 group-hover:scale-110"
                            aria-hidden="true"
                          />
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-foreground">{cap.title}</h3>
                            <ArrowUpRight
                              className="h-4 w-4 shrink-0 text-primary-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                              aria-hidden="true"
                            />
                          </div>
                          <p className="mt-1 text-base leading-relaxed text-foreground">
                            {cap.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  </ScrollReveal>
                );
              })}
            </ul>
          </div>

          {/* ── Right column ──────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Metrics card */}
            <ScrollReveal direction="right">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <span className="text-base font-bold text-foreground">AI Analytics Overview</span>
                  <span className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                    Live
                  </span>
                </div>

                <div
                  className="grid grid-cols-2 divide-x divide-y divide-border"
                  role="list"
                  aria-label="Key metrics"
                >
                  {mockMetrics.map((m) => (
                    <div
                      key={m.label}
                      role="listitem"
                      className="flex flex-col gap-1 px-5 py-5 transition-colors duration-150 hover:bg-muted/40"
                    >
                      <p className="text-sm font-medium text-foreground">{m.label}</p>
                      <p className="text-3xl font-extrabold tracking-tight text-foreground">
                        {m.value}
                      </p>
                      <p className={cn("text-sm font-semibold", m.positive ? "text-success" : "text-danger")}>
                        {m.change} vs. last period
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Bar chart card */}
            <ScrollReveal delay={140} direction="right">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-base font-bold text-foreground">Response Volume</p>
                  <span className="text-sm font-medium text-foreground">Last 7 days</span>
                </div>

                <div
                  className="flex items-end gap-2"
                  role="img"
                  aria-label="Bar chart: response volume over 7 days"
                >
                  {barData.map((val, i) => (
                    <div key={i} className="group/bar flex flex-1 flex-col items-center gap-1.5">
                      <div
                        className="relative w-full overflow-hidden rounded-t-md bg-primary-100 dark:bg-primary-900/30"
                        style={{ height: "96px" }}
                      >
                        <div
                          className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-300 group-hover/bar:from-primary-700 group-hover/bar:to-primary-500"
                          style={{ height: `${(val / maxBar) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {days[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </div>
    </section>
  );
}
