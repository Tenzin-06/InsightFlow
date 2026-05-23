import { useMemo } from "react";
import { FlaskConical, ShieldCheck, Users } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SimulationShell } from "@/features/simulation/components/simulation-shell";
import { SimulationWarning } from "@/features/simulation/components/simulation-warning";
import { SimulationConfigForm } from "@/features/simulation/components/simulation-config-form";
import { SimulationRunner } from "@/features/simulation/components/simulation-runner";
import { SimulationResults } from "@/features/simulation/components/simulation-results";
import { SyntheticResponsePreviewPanel } from "@/features/simulation/components/synthetic-response-preview";
import { SimulationMetricsPanel } from "@/features/simulation/components/simulation-metrics";
import { useSimulation } from "@/features/simulation/hooks/use-simulation";
import { usePersonas } from "@/features/simulation/hooks/use-personas";
import { useSurveys } from "@/features/surveys/hooks/use-surveys";

export default function SimulationPage() {
  const simulation = useSimulation();
  const personasQuery = usePersonas();
  const surveysQuery = useSurveys();

  const runData = simulation.detailsQuery.data;
  const recentRuns = simulation.runsQuery.data?.results ?? [];
  const personas = personasQuery.data ?? [];
  const surveys = surveysQuery.data ?? [];

  const sidePanel = useMemo(
    () => (
      <>
        <div className="rounded-lg border border-border-default bg-bg-secondary p-4">
          <h3 className="text-sm font-semibold text-text-primary">Safety Status</h3>
          <div className="mt-3 space-y-2 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
              <span>Sandbox mode enforced</span>
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-orange-600" aria-hidden="true" />
              <span>Synthetic labels active</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-info" aria-hidden="true" />
              <span>{personas.length} personas available</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border-default bg-bg-secondary p-4">
          <h3 className="text-sm font-semibold text-text-primary">Active Simulations</h3>
          <ul className="mt-3 space-y-2 text-xs">
            {simulation.activeRuns.length === 0 ? (
              <li className="text-text-muted">No active runs.</li>
            ) : (
              simulation.activeRuns.map((run) => (
                <li key={run.id} className="rounded-md bg-bg-muted px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => simulation.setSelectedRunId(run.id)}
                    className="w-full text-left text-text-primary"
                  >
                    {run.run_name} ({run.status})
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <SimulationMetricsPanel metrics={runData?.metrics ?? null} />
      </>
    ),
    [personas.length, runData?.metrics, simulation],
  );

  return (
    <PageContainer>
      <SimulationShell
        title="Simulation Workspace"
        subtitle="Create and run synthetic survey simulations in a controlled sandbox."
        sidePanel={sidePanel}
      >
        <SimulationWarning description="All generated outputs are synthetic and isolated from production analytics." />

        <section className="rounded-lg border border-border-default bg-bg-secondary p-5">
          <h2 className="text-sm font-semibold text-text-primary">Create Simulation</h2>
          <p className="mt-1 text-xs text-text-secondary">
            Configure personas, execution constraints, and generation mode before launching a run.
          </p>
          <div className="mt-4">
            <SimulationConfigForm
              personas={personas}
              surveys={surveys}
              onSubmit={async (payload) => {
                await simulation.createRun(payload);
              }}
            />
          </div>
        </section>

        <SimulationRunner
          run={runData?.run ?? null}
          events={runData?.events ?? []}
          isPolling={simulation.detailsQuery.isFetching}
        />

        <SimulationResults run={runData?.run ?? null} metrics={runData?.metrics ?? null} />
        <SyntheticResponsePreviewPanel responses={runData?.responses ?? []} />

        <section className="rounded-lg border border-border-default bg-bg-secondary p-5">
          <h2 className="text-sm font-semibold text-text-primary">Recent Simulation Runs</h2>
          <ul className="mt-3 space-y-2">
            {recentRuns.length === 0 ? (
              <li className="text-sm text-text-muted">No simulation runs yet.</li>
            ) : (
              recentRuns.map((run) => (
                <li key={run.id} className="rounded-md border border-border-soft bg-bg-muted px-3 py-2">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => simulation.setSelectedRunId(run.id)}
                  >
                    <p className="text-sm font-medium text-text-primary">{run.run_name}</p>
                    <p className="text-xs text-text-secondary">
                      {run.status} • responses {run.requested_responses}
                    </p>
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
