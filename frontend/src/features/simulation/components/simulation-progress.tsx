import { Progress } from "@/components/ui/progress";
import { SIMULATION_STATUS_STAGES } from "@/features/simulation/constants";
import type { SimulationRun } from "@/features/simulation/types";

type SimulationProgressProps = {
  run: SimulationRun | null;
};

function statusToPercent(status: SimulationRun["status"]): number {
  const index = SIMULATION_STATUS_STAGES.findIndex((stage) => stage === status);
  if (index < 0) {
    if (status === "failed" || status === "blocked") {
      return 100;
    }
    return 5;
  }
  return Math.round(((index + 1) / SIMULATION_STATUS_STAGES.length) * 100);
}

export function SimulationProgress({ run }: SimulationProgressProps) {
  if (!run) {
    return null;
  }

  const progress = statusToPercent(run.status);

  return (
    <div className="rounded-lg border border-border-default bg-bg-secondary p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
        <span>Simulation Progress</span>
        <span className="font-semibold uppercase text-text-primary">{run.status}</span>
      </div>
      <Progress value={progress} />
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-text-secondary md:grid-cols-4">
        <div>
          <p className="font-semibold text-text-primary">Responses</p>
          <p>{run.requested_responses}</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">AI Jobs</p>
          <p>{run.ai_job_limit}</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Runtime</p>
          <p>{run.runtime_limit_minutes}m</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Created</p>
          <p>{new Date(run.created_at).toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}

