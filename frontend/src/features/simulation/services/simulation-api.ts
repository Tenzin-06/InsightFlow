import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getRequest, postRequest } from "@/lib/api/utils";
import type { ApiResponse } from "@/lib/api/types";
import type {
  CreateSimulationRunPayload,
  PaginatedResponse,
  SimulationEvent,
  SimulationMetrics,
  SimulationRun,
  SyntheticResponsePreview,
} from "@/features/simulation/types";

type SimulationRunApiModel = Omit<SimulationRun, "id" | "survey"> & {
  id: number;
  survey: number;
  events?: Array<{
    id: number;
    action_type: string;
    status: "success" | "failed" | "blocked" | "info";
    message: string;
    timestamp: string;
    metadata: Record<string, unknown>;
  }>;
};

function mapRun(run: SimulationRunApiModel): SimulationRun {
  return {
    ...run,
    id: String(run.id),
    survey: String(run.survey),
  };
}

function eventFromRun(run: SimulationRunApiModel): SimulationEvent[] {
  return (run.events ?? []).map((event) => ({
    id: String(event.id),
    action_type: event.action_type,
    status: event.status,
    message: event.message,
    timestamp: event.timestamp,
    metadata: event.metadata,
  }));
}

function synthesizeResponsePreview(run: SimulationRun): SyntheticResponsePreview[] {
  const total = Math.min(Math.max(run.requested_responses, 0), 5);
  return Array.from({ length: total }).map((_, index) => ({
    id: `${run.id}-synthetic-${index + 1}`,
    persona_id: `persona-${index + 1}`,
    persona_name: `Synthetic Persona ${index + 1}`,
    question: "How would you rate this survey flow?",
    response: `Synthetic response ${index + 1} generated in ${String(run.status)} state.`,
    confidence: 0.76 + index * 0.03,
    created_at: new Date().toISOString(),
    ai_generated: true,
  }));
}

function buildMetrics(run: SimulationRun): SimulationMetrics {
  const responsesGenerated = run.status === "completed" ? run.requested_responses : Math.floor(run.requested_responses * 0.6);
  const runtimeDuration = run.started_at && run.completed_at
    ? Math.max(0, (new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()) / 1000)
    : 0;

  return {
    personas_active: Number(run.metadata.persona_count ?? 0),
    responses_generated: responsesGenerated,
    ai_tasks_completed: Math.min(run.ai_job_limit, Math.max(0, Math.floor(responsesGenerated / 5))),
    runtime_duration_seconds: Math.floor(runtimeDuration),
    error_count: run.status === "failed" || run.status === "blocked" ? 1 : 0,
    completion_rate: run.requested_responses > 0 ? Math.round((responsesGenerated / run.requested_responses) * 100) : 0,
    sentiment_distribution: [
      { label: "Positive", value: 52 },
      { label: "Neutral", value: 33 },
      { label: "Negative", value: 15 },
    ],
  };
}

export async function getSimulationRuns(limit = 20, offset = 0): Promise<PaginatedResponse<SimulationRun>> {
  const response = await getRequest<ApiResponse<PaginatedResponse<SimulationRunApiModel>>>(
    `${API_ENDPOINTS.simulation.runs}?limit=${limit}&offset=${offset}`,
  );
  return {
    ...response.data,
    results: response.data.results.map(mapRun),
  };
}

export async function createSimulationRun(payload: CreateSimulationRunPayload): Promise<SimulationRun> {
  const response = await postRequest<ApiResponse<SimulationRunApiModel>, Omit<CreateSimulationRunPayload, "persona_ids" | "generation_mode">>(
    API_ENDPOINTS.simulation.runs,
    {
      survey_id: payload.survey_id,
      run_name: payload.run_name,
      requested_responses: payload.requested_responses,
      ai_job_limit: payload.ai_job_limit,
      runtime_limit_minutes: payload.runtime_limit_minutes,
      allow_external_api: payload.allow_external_api,
      metadata: {
        ...payload.metadata,
        persona_ids: payload.persona_ids,
        persona_count: payload.persona_ids.length,
        generation_mode: payload.generation_mode,
      },
    },
  );
  return mapRun(response.data);
}

export async function getSimulationRunDetails(id: string): Promise<{
  run: SimulationRun;
  events: SimulationEvent[];
  responses: SyntheticResponsePreview[];
  metrics: SimulationMetrics;
}> {
  const response = await getRequest<ApiResponse<SimulationRunApiModel>>(
    API_ENDPOINTS.simulation.runDetail(id),
  );
  const run = mapRun(response.data);
  return {
    run,
    events: eventFromRun(response.data),
    responses: synthesizeResponsePreview(run),
    metrics: buildMetrics(run),
  };
}

