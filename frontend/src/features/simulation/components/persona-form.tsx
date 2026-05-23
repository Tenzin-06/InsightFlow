import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { CreatePersonaPayload, SimulationPersona } from "@/features/simulation/types";

const personaSchema = z.object({
  name: z.string().min(2),
  age_range: z.string().min(3),
  education: z.string().min(2),
  occupation: z.string().min(2),
  region: z.string().min(2),
  communication_style: z.enum(["formal", "neutral", "casual"]),
  engagement_level: z.enum(["low", "medium", "high"]),
  response_depth: z.enum(["brief", "moderate", "detailed"]),
  technology_familiarity: z.enum(["low", "medium", "high"]),
  response_tone: z.enum(["analytical", "balanced", "opinionated"]),
});

type PersonaFormValues = z.infer<typeof personaSchema>;

type PersonaFormProps = {
  initialPersona?: SimulationPersona | null;
  onSubmit: (payload: CreatePersonaPayload) => Promise<void> | void;
  submitLabel: string;
};

export function PersonaForm({ initialPersona, onSubmit, submitLabel }: PersonaFormProps) {
  const form = useForm<PersonaFormValues>({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      name: "",
      age_range: "25-34",
      education: "Bachelors",
      occupation: "",
      region: "",
      communication_style: "neutral",
      engagement_level: "medium",
      response_depth: "moderate",
      technology_familiarity: "medium",
      response_tone: "balanced",
    },
  });

  useEffect(() => {
    if (!initialPersona) {
      return;
    }
    form.reset({
      name: initialPersona.name,
      age_range: initialPersona.age_range,
      education: initialPersona.education,
      occupation: initialPersona.occupation,
      region: initialPersona.region,
      communication_style: initialPersona.metadata.communication_style,
      engagement_level: initialPersona.metadata.engagement_level,
      response_depth: initialPersona.metadata.response_depth,
      technology_familiarity: initialPersona.metadata.technology_familiarity,
      response_tone: initialPersona.metadata.response_tone,
    });
  }, [form, initialPersona]);

  const values = form.watch();

  async function submit(values: PersonaFormValues) {
    await onSubmit({
      name: values.name,
      age_range: values.age_range,
      education: values.education,
      occupation: values.occupation,
      region: values.region,
      prohibited_traits: [],
      metadata: {
        communication_style: values.communication_style,
        engagement_level: values.engagement_level,
        response_depth: values.response_depth,
        technology_familiarity: values.technology_familiarity,
        response_tone: values.response_tone,
      },
    });
    if (!initialPersona) {
      form.reset();
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="persona-name">Persona Name</Label>
          <Input id="persona-name" value={values.name} onChange={(event) => form.setValue("name", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age-range">Age Range</Label>
          <Input id="age-range" value={values.age_range} onChange={(event) => form.setValue("age_range", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="education">Education</Label>
          <Input id="education" value={values.education} onChange={(event) => form.setValue("education", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input id="occupation" value={values.occupation} onChange={(event) => form.setValue("occupation", event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input id="region" value={values.region} onChange={(event) => form.setValue("region", event.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SelectField label="Communication Style" value={values.communication_style} onValueChange={(value) => form.setValue("communication_style", value as PersonaFormValues["communication_style"])} options={["formal", "neutral", "casual"]} />
        <SelectField label="Engagement Level" value={values.engagement_level} onValueChange={(value) => form.setValue("engagement_level", value as PersonaFormValues["engagement_level"])} options={["low", "medium", "high"]} />
        <SelectField label="Response Depth" value={values.response_depth} onValueChange={(value) => form.setValue("response_depth", value as PersonaFormValues["response_depth"])} options={["brief", "moderate", "detailed"]} />
        <SelectField label="Tech Familiarity" value={values.technology_familiarity} onValueChange={(value) => form.setValue("technology_familiarity", value as PersonaFormValues["technology_familiarity"])} options={["low", "medium", "high"]} />
        <SelectField label="Response Tone" value={values.response_tone} onValueChange={(value) => form.setValue("response_tone", value as PersonaFormValues["response_tone"])} options={["analytical", "balanced", "opinionated"]} />
      </div>

      <Button type="submit" className="bg-orange-600 hover:bg-orange-700">{submitLabel}</Button>
    </form>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
};

function SelectField({ label, value, options, onValueChange }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

