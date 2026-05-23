export type SimulationRunStatus =
  | "pending"
  | "validating"
  | "running"
  | "generating"
  | "aggregating"
  | "completed"
  | "failed"
  | "blocked"
  | "archived";

export type PersonaCommunicationStyle = "formal" | "neutral" | "casual";
export type PersonaEngagementLevel = "low" | "medium" | "high";
export type PersonaResponseTone = "analytical" | "balanced" | "opinionated";
export type PersonaResponseDepth = "brief" | "moderate" | "detailed";

export type PersonaMetadata = {
  communication_style: PersonaCommunicationStyle;
  engagement_level: PersonaEngagementLevel;
  response_depth: PersonaResponseDepth;
  technology_familiarity: "low" | "medium" | "high";
  response_tone: PersonaResponseTone;
};

export type SimulationPersona = {
  id: string;
  owner_id: string;
  name: string;
  age_range: string;
  education: string;
  occupation: string;
  region: string;
  metadata: PersonaMetadata;
  prohibited_traits: string[];
  usage_count: number;
  created_at: string;
  updated_at: string;
};

export type SimulationRun = {
  id: string;
  survey: string;
  run_name: string;
  status: SimulationRunStatus;
  requested_responses: number;
  ai_job_limit: number;
  runtime_limit_minutes: number;
  allow_external_api: boolean;
  is_simulated: boolean;
  metadata: Record<string, unknown>;
  error_message?: string;
  created_at: string;
  updated_at: string;
  started_at?: string | null;
  completed_at?: string | null;
};

export type SimulationEvent = {
  id: string;
  action_type: string;
  status: "success" | "failed" | "blocked" | "info";
  message: string;
  timestamp: string;
  metadata: Record<string, unknown>;
};

export type SyntheticResponsePreview = {
  id: string;
  persona_id: string;
  persona_name: string;
  question: string;
  response: string;
  confidence: number;
  created_at: string;
  ai_generated: true;
};

export type SimulationMetrics = {
  personas_active: number;
  responses_generated: number;
  ai_tasks_completed: number;
  runtime_duration_seconds: number;
  error_count: number;
  completion_rate: number;
  sentiment_distribution: { label: string; value: number }[];
};

export type CreateSimulationRunPayload = {
  survey_id: number;
  run_name: string;
  requested_responses: number;
  ai_job_limit: number;
  runtime_limit_minutes: number;
  allow_external_api: boolean;
  persona_ids: string[];
  generation_mode: "balanced" | "diverse" | "strict";
  metadata: Record<string, unknown>;
};

export type CreatePersonaPayload = {
  name: string;
  age_range: string;
  education: string;
  occupation: string;
  region: string;
  metadata: PersonaMetadata;
  prohibited_traits: string[];
};

export type UpdatePersonaPayload = Partial<CreatePersonaPayload>;

export type PaginatedResponse<T> = {
  count: number;
  limit: number;
  offset: number;
  results: T[];
};

