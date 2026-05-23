import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersonaSelector } from "@/features/simulation/components/persona-selector";
import type { CreateSimulationRunPayload, SimulationPersona } from "@/features/simulation/types";
import type { Survey } from "@/features/surveys/types";

const configSchema = z.object({
  survey_id: z.number().int().positive(),
  run_name: z.string().min(3),
  requested_responses: z.number().int().min(1).max(10000),
  ai_job_limit: z.number().int().min(0).max(500),
  runtime_limit_minutes: z.number().int().min(1).max(120),
  generation_mode: z.enum(["balanced", "diverse", "strict"]),
  allow_external_api: z.enum(["false", "true"]),
});

type ConfigFormValues = z.infer<typeof configSchema>;

type SimulationConfigFormProps = {
  personas: SimulationPersona[];
  surveys: Survey[];
  onSubmit: (payload: CreateSimulationRunPayload) => Promise<void> | void;
};

export function SimulationConfigForm({ personas, surveys, onSubmit }: SimulationConfigFormProps) {
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      survey_id: 1,
      run_name: "Simulation Run",
      requested_responses: 100,
      ai_job_limit: 10,
      runtime_limit_minutes: 30,
      generation_mode: "balanced",
      allow_external_api: "false",
    },
  });
  const [selectedPersonaIds, setSelectedPersonaIds] = useState<string[]>([]);
  const values = form.watch();

  async function submit(values: ConfigFormValues) {
    await onSubmit({
      ...values,
      allow_external_api: values.allow_external_api === "true",
      persona_ids: selectedPersonaIds,
      metadata: {
        execution_constraints: "sandbox",
      },
    });
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Survey Selection">
          {surveys.length > 0 ? (
            <Select
              value={String(values.survey_id)}
              onValueChange={(value) => form.setValue("survey_id", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select survey" />
              </SelectTrigger>
              <SelectContent>
                {surveys.map((survey) => (
                  <SelectItem key={survey.id} value={survey.id}>
                    {survey.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={String(values.survey_id)}
              onChange={(event) => form.setValue("survey_id", Number(event.target.value || 0))}
              inputMode="numeric"
            />
          )}
        </Field>
        <Field label="Run Name">
          <Input
            value={values.run_name}
            onChange={(event) => form.setValue("run_name", event.target.value)}
          />
        </Field>
        <Field label="Synthetic Response Count">
          <Input
            value={String(values.requested_responses)}
            onChange={(event) => form.setValue("requested_responses", Number(event.target.value || 0))}
            inputMode="numeric"
          />
        </Field>
        <Field label="AI Job Limit">
          <Input
            value={String(values.ai_job_limit)}
            onChange={(event) => form.setValue("ai_job_limit", Number(event.target.value || 0))}
            inputMode="numeric"
          />
        </Field>
        <Field label="Runtime Limit (minutes)">
          <Input
            value={String(values.runtime_limit_minutes)}
            onChange={(event) => form.setValue("runtime_limit_minutes", Number(event.target.value || 0))}
            inputMode="numeric"
          />
        </Field>
        <Field label="AI Generation Mode">
          <Select value={values.generation_mode} onValueChange={(value) => form.setValue("generation_mode", value as ConfigFormValues["generation_mode"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balanced">balanced</SelectItem>
              <SelectItem value="diverse">diverse</SelectItem>
              <SelectItem value="strict">strict</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="External API Access">
        <Select value={values.allow_external_api} onValueChange={(value) => form.setValue("allow_external_api", value as ConfigFormValues["allow_external_api"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">Disabled</SelectItem>
            <SelectItem value="true">Enabled</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <PersonaSelector
        personas={personas}
        selectedPersonaIds={selectedPersonaIds}
        onTogglePersona={(personaId) => {
          setSelectedPersonaIds((current) =>
            current.includes(personaId)
              ? current.filter((id) => id !== personaId)
              : [...current, personaId],
          );
        }}
      />

      <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-xs text-orange-900">
        Preview: {selectedPersonaIds.length} persona(s), {values.requested_responses} target responses, runtime cap {values.runtime_limit_minutes}m.
      </div>

      <Button
        type="submit"
        disabled={selectedPersonaIds.length === 0}
        className="bg-orange-600 hover:bg-orange-700"
      >
        Run Synthetic Execution
      </Button>
    </form>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
