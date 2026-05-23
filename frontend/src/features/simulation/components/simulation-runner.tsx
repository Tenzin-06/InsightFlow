import { AlertCircle, LoaderCircle, ShieldCheck, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SimulationProgress } from "@/features/simulation/components/simulation-progress";
import type { SimulationEvent, SimulationRun } from "@/features/simulation/types";

type SimulationRunnerProps = {
  run: SimulationRun | null;
  events: SimulationEvent[];
  isPolling: boolean;
};

export function SimulationRunner({ run, events, isPolling }: SimulationRunnerProps) {
  return (
    <section className="space-y-4 rounded-lg border border-border-default bg-bg-secondary p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Simulation Runner</h2>
        <div className="flex items-center gap-2">
          {isPolling && (
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              monitoring
            </span>
          )}
          <Button size="sm" variant="outline" disabled>
            Cancel Run
          </Button>
        </div>
      </div>

      <SimulationProgress run={run} />

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Execution Events</h3>
        {events.length === 0 ? (
          <p className="text-sm text-text-muted">No execution events yet.</p>
        ) : (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="rounded-md border border-border-soft bg-bg-muted px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <StatusIcon status={event.status} />
                  <span className="font-medium text-text-primary">{event.action_type}</span>
                  <span className="ml-auto text-xs text-text-muted">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-secondary">{event.message || "Event logged."}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function StatusIcon({ status }: { status: SimulationEvent["status"] }) {
  if (status === "failed") {
    return <XCircle className="h-4 w-4 text-danger" aria-hidden="true" />;
  }
  if (status === "blocked") {
    return <AlertCircle className="h-4 w-4 text-warning" aria-hidden="true" />;
  }
  return <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />;
}

