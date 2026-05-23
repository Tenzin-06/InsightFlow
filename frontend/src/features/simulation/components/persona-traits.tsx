import type { SimulationPersona } from "@/features/simulation/types";

type PersonaTraitsProps = {
  persona: SimulationPersona;
};

export function PersonaTraits({ persona }: PersonaTraitsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
      <div className="rounded-md bg-bg-muted p-2">
        <p className="font-semibold text-text-primary">Communication</p>
        <p>{persona.metadata.communication_style}</p>
      </div>
      <div className="rounded-md bg-bg-muted p-2">
        <p className="font-semibold text-text-primary">Engagement</p>
        <p>{persona.metadata.engagement_level}</p>
      </div>
      <div className="rounded-md bg-bg-muted p-2">
        <p className="font-semibold text-text-primary">Response Depth</p>
        <p>{persona.metadata.response_depth}</p>
      </div>
      <div className="rounded-md bg-bg-muted p-2">
        <p className="font-semibold text-text-primary">Tone</p>
        <p>{persona.metadata.response_tone}</p>
      </div>
    </div>
  );
}

