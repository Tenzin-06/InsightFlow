import { PageContainer } from "@/components/layout/page-container";
import { SimulationShell } from "@/features/simulation/components/simulation-shell";
import { SimulationWarning } from "@/features/simulation/components/simulation-warning";
import { SimulationRunner } from "@/features/simulation/components/simulation-runner";
import { useSimulation } from "@/features/simulation/hooks/use-simulation";

export default function SimulationRunsPage() {
  const simulation = useSimulation();
  const runs = simulation.runsQuery.data?.results ?? [];
  const detail = simulation.detailsQuery.data;

  return (
    <PageContainer>
      <SimulationShell
        title="Simulation Runs"
        subtitle="Monitor asynchronous run execution, status transitions, and safeguard events."
        sidePanel={
          <div className="rounded-lg border border-border-default bg-bg-secondary p-4">
            <h3 className="text-sm font-semibold text-text-primary">Run History</h3>
            <p className="mt-1 text-xs text-text-secondary">{runs.length} total runs available.</p>
          </div>
        }
      >
        <SimulationWarning description="Simulation execution and status updates are isolated from production workflows." />

        <section className="rounded-lg border border-border-default bg-bg-secondary p-5">
          <h2 className="text-sm font-semibold text-text-primary">Recent Runs</h2>
          <ul className="mt-3 space-y-2">
            {runs.length === 0 ? (
              <li className="text-sm text-text-muted">No runs found.</li>
            ) : (
              runs.map((run) => (
                <li key={run.id} className="rounded-md border border-border-soft bg-bg-muted p-3">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => simulation.setSelectedRunId(run.id)}
                  >
                    <p className="text-sm font-medium text-text-primary">{run.run_name}</p>
                    <p className="text-xs text-text-secondary">
                      {run.status} • requested {run.requested_responses}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        <SimulationRunner
          run={detail?.run ?? null}
          events={detail?.events ?? []}
          isPolling={simulation.detailsQuery.isFetching}
        />
      </SimulationShell>
    </PageContainer>
  );
}

