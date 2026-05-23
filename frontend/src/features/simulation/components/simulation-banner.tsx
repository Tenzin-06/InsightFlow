import { ShieldAlert } from "lucide-react";

import { SIMULATION_WARNING_TEXT } from "@/features/simulation/constants";

export function SimulationBanner() {
  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-orange-900">
      <div className="flex items-start gap-2">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">Sandbox Mode</p>
          <p className="text-xs">{SIMULATION_WARNING_TEXT}</p>
        </div>
      </div>
    </div>
  );
}

