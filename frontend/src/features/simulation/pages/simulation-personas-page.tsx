import { useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { SimulationShell } from "@/features/simulation/components/simulation-shell";
import { SimulationWarning } from "@/features/simulation/components/simulation-warning";
import { PersonaCard } from "@/features/simulation/components/persona-card";
import { PersonaForm } from "@/features/simulation/components/persona-form";
import { useCreatePersona, usePersonas, useUpdatePersona } from "@/features/simulation/hooks/use-personas";
import type { SimulationPersona } from "@/features/simulation/types";

export default function SimulationPersonasPage() {
  const personasQuery = usePersonas();
  const createPersona = useCreatePersona();
  const updatePersona = useUpdatePersona();
  const [editingPersona, setEditingPersona] = useState<SimulationPersona | null>(null);

  const personas = personasQuery.data ?? [];

  return (
    <PageContainer>
      <SimulationShell
        title="Persona Management"
        subtitle="Define synthetic participant archetypes with controlled demographic and behavioral traits."
        sidePanel={
          <div className="rounded-lg border border-border-default bg-bg-secondary p-4">
            <h3 className="text-sm font-semibold text-text-primary">Persona Library</h3>
            <p className="mt-1 text-xs text-text-secondary">
              {personas.length} personas available for simulation configuration and reuse.
            </p>
          </div>
        }
      >
        <SimulationWarning description="Personas represent synthetic participant archetypes only." />

        <section className="rounded-lg border border-border-default bg-bg-secondary p-5">
          <h2 className="text-sm font-semibold text-text-primary">
            {editingPersona ? "Edit Persona" : "Create Persona"}
          </h2>
          <div className="mt-4">
            <PersonaForm
              initialPersona={editingPersona}
              submitLabel={editingPersona ? "Update Persona" : "Save Persona"}
              onSubmit={async (payload) => {
                if (editingPersona) {
                  await updatePersona.mutateAsync({ id: editingPersona.id, payload });
                  setEditingPersona(null);
                  return;
                }
                await createPersona.mutateAsync(payload);
              }}
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text-primary">Persona Library</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                onEdit={setEditingPersona}
              />
            ))}
          </div>
        </section>
      </SimulationShell>
    </PageContainer>
  );
}

