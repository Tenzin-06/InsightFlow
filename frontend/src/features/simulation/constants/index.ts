import type { SimulationPersona } from "@/features/simulation/types";

export const SIMULATION_STATUS_STAGES = [
  "validating",
  "running",
  "generating",
  "aggregating",
  "completed",
] as const;

export const DEFAULT_PERSONAS: SimulationPersona[] = [
  {
    id: "persona-1",
    owner_id: "local",
    name: "Urban Graduate Researcher",
    age_range: "25-34",
    education: "Masters",
    occupation: "Research Assistant",
    region: "Urban",
    metadata: {
      communication_style: "formal",
      engagement_level: "high",
      response_depth: "detailed",
      technology_familiarity: "high",
      response_tone: "analytical",
    },
    prohibited_traits: [],
    usage_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "persona-2",
    owner_id: "local",
    name: "Rural Field Officer",
    age_range: "35-44",
    education: "Bachelors",
    occupation: "Field Officer",
    region: "Rural",
    metadata: {
      communication_style: "neutral",
      engagement_level: "medium",
      response_depth: "moderate",
      technology_familiarity: "medium",
      response_tone: "balanced",
    },
    prohibited_traits: [],
    usage_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const SIMULATION_WARNING_TEXT = "Synthetic Data - Not Production Analytics";

