import type { SimulationMetrics } from "@/features/simulation/types";

type SimulationMetricsProps = {
  metrics: SimulationMetrics | null;
};

export function SimulationMetricsPanel({ metrics }: SimulationMetricsProps) {
  if (!metrics) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-secondary p-4 text-sm text-text-muted">
        Metrics will appear after a simulation run is selected.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-border-default bg-bg-secondary p-4">
      <h3 className="text-sm font-semibold text-text-primary">Synthetic Metrics</h3>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <Metric title="Personas Active" value={metrics.personas_active} />
        <Metric title="Responses Generated" value={metrics.responses_generated} />
        <Metric title="AI Tasks Completed" value={metrics.ai_tasks_completed} />
        <Metric title="Error Count" value={metrics.error_count} />
        <Metric title="Runtime (s)" value={metrics.runtime_duration_seconds} />
        <Metric title="Completion %" value={metrics.completion_rate} />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-md bg-bg-muted p-2">
      <p className="text-text-muted">{title}</p>
      <p className="text-base font-semibold text-text-primary">{value}</p>
    </div>
  );
}

