import { PersonaCard } from "@/features/simulation/components/persona-card";
import type { SimulationPersona } from "@/features/simulation/types";

type PersonaSelectorProps = {
  personas: SimulationPersona[];
  selectedPersonaIds: string[];
  onTogglePersona: (id: string) => void;
};

export function PersonaSelector({ personas, selectedPersonaIds, onTogglePersona }: PersonaSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">Persona Group</h3>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            selectable
            selected={selectedPersonaIds.includes(persona.id)}
            onSelect={onTogglePersona}
          />
        ))}
      </div>
    </div>
  );
}

