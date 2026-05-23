import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageContainer } from "@/components/layout/page-container";
import { SimulationShell } from "@/features/simulation/components/simulation-shell";
import { SimulationWarning } from "@/features/simulation/components/simulation-warning";
import { SimulationMetricsPanel } from "@/features/simulation/components/simulation-metrics";
import { useSimulation } from "@/features/simulation/hooks/use-simulation";

export default function SimulationAnalyticsPage() {
  const simulation = useSimulation();
  const runs = simulation.runsQuery.data?.results ?? [];
  const metrics = simulation.detailsQuery.data?.metrics ?? null;

  const data = runs.slice(0, 6).map((run) => ({
    name: run.run_name.slice(0, 14),
    requested: run.requested_responses,
    aiJobs: run.ai_job_limit,
  }));

  return (
    <PageContainer>
      <SimulationShell
        title="Simulation Analytics"
        subtitle="Review synthetic run metrics and distribution insights in a dedicated analytics workspace."
        sidePanel={<SimulationMetricsPanel metrics={metrics} />}
      >
        <SimulationWarning description="Synthetic Data - Not Production Analytics" />

        <section className="rounded-lg border border-border-default bg-bg-secondary p-5">
          <h2 className="text-sm font-semibold text-text-primary">Run Comparison</h2>
          <div className="mt-3 h-72 rounded-md border border-border-soft bg-bg-muted p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requested" fill="#f97316" radius={4} />
                <Bar dataKey="aiJobs" fill="#0ea5e9" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-lg border border-border-default bg-bg-secondary p-5">
          <h2 className="text-sm font-semibold text-text-primary">Runs</h2>
          <ul className="mt-3 space-y-2">
            {runs.length === 0 ? (
              <li className="text-sm text-text-muted">No runs available.</li>
            ) : (
              runs.map((run) => (
                <li key={run.id} className="rounded-md border border-border-soft bg-bg-muted px-3 py-2">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => simulation.setSelectedRunId(run.id)}
                  >
                    <p className="text-sm font-medium text-text-primary">{run.run_name}</p>
                    <p className="text-xs text-text-secondary">{run.status}</p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </SimulationShell>
    </PageContainer>
  );
}

