import { UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PersonaTraits } from "@/features/simulation/components/persona-traits";
import type { SimulationPersona } from "@/features/simulation/types";

type PersonaCardProps = {
  persona: SimulationPersona;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (persona: SimulationPersona) => void;
};

export function PersonaCard({ persona, selected = false, selectable = false, onSelect, onEdit }: PersonaCardProps) {
  return (
    <article
      className={[
        "rounded-lg border p-4 shadow-sm transition",
        selected ? "border-orange-400 bg-orange-50" : "border-border-default bg-bg-secondary",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-orange-600" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-text-primary">{persona.name}</h3>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            {persona.age_range} • {persona.education} • {persona.region}
          </p>
        </div>
        <Badge variant="outline">Used {persona.usage_count}x</Badge>
      </div>

      <p className="mt-3 text-xs text-text-secondary">
        {persona.occupation}
      </p>

      <div className="mt-3">
        <PersonaTraits persona={persona} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        {selectable && (
          <button
            type="button"
            onClick={() => onSelect?.(persona.id)}
            className="rounded-md border border-orange-300 bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-900"
          >
            {selected ? "Selected" : "Select"}
          </button>
        )}
        <button
          type="button"
          onClick={() => onEdit?.(persona)}
          className="rounded-md border border-border-default px-3 py-1.5 text-xs font-semibold text-text-secondary"
        >
          Edit
        </button>
      </div>
    </article>
  );
}

