import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { SimulationWarning } from "@/features/simulation/components/simulation-warning";
import type { SimulationMetrics, SimulationRun } from "@/features/simulation/types";

type SimulationResultsProps = {
  run: SimulationRun | null;
  metrics: SimulationMetrics | null;
};

const COLORS = ["#22c55e", "#0ea5e9", "#f97316"];

export function SimulationResults({ run, metrics }: SimulationResultsProps) {
  return (
    <section className="space-y-4 rounded-lg border border-border-default bg-bg-secondary p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Simulation Results</h2>
        <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
          Simulation Run
        </span>
      </div>

      <SimulationWarning description="Synthetic Data - Not Production Analytics" />

      {!run || !metrics ? (
        <p className="text-sm text-text-muted">Select a simulation run to view generated outputs.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-border-soft bg-bg-muted p-3">
            <p className="text-xs text-text-secondary">Run Summary</p>
            <p className="mt-1 text-sm text-text-primary">{run.run_name}</p>
            <p className="mt-1 text-xs text-text-secondary">
              Status: <span className="font-semibold text-text-primary">{run.status}</span>
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Requested: {run.requested_responses} responses
            </p>
          </div>
          <div className="h-44 rounded-md border border-border-soft bg-bg-muted p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.sentiment_distribution}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={34}
                  outerRadius={58}
                >
                  {metrics.sentiment_distribution.map((segment, index) => (
                    <Cell key={segment.label} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}

