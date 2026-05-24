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

// ---------------------------------------------------------------------------
// API model shapes
// ---------------------------------------------------------------------------

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

type SimulationResultsApiModel = {
  run_id: number;
  run_status: string;
  dataset_id: number;
  generated_records: number;
  persona_count: number;
  responses: Array<{
    persona_id: string;
    persona_name: string;
    responses: Array<{
      question_id: number;
      question: string;
      answer: string;
      confidence: number;
    }>;
  }>;
};

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

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

/**
 * Flatten the nested per-persona responses from the backend into the
 * SyntheticResponsePreview[] shape the UI components expect.
 */
function flattenResults(results: SimulationResultsApiModel): SyntheticResponsePreview[] {
  const flat: SyntheticResponsePreview[] = [];
  for (const persona of results.responses) {
    for (const resp of persona.responses) {
      flat.push({
        id: `${results.run_id}-${persona.persona_id}-${resp.question_id}`,
        persona_id: persona.persona_id,
        persona_name: persona.persona_name,
        question: resp.question,
        response: resp.answer,
        confidence: resp.confidence,
        created_at: new Date().toISOString(),
        ai_generated: true,
      });
    }
  }
  return flat;
}

function buildMetrics(run: SimulationRun, generatedRecords?: number): SimulationMetrics {
  const responsesGenerated =
    generatedRecords ??
    (run.status === "completed"
      ? run.requested_responses
      : Math.floor(run.requested_responses * 0.6));

  const runtimeDuration =
    run.started_at && run.completed_at
      ? Math.max(
          0,
          (new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()) / 1000,
        )
      : 0;

  return {
    personas_active: Number(run.metadata.persona_count ?? 0),
    responses_generated: responsesGenerated,
    ai_tasks_completed: Math.min(
      run.ai_job_limit,
      Math.max(0, Math.floor(responsesGenerated / 5)),
    ),
    runtime_duration_seconds: Math.floor(runtimeDuration),
    error_count: run.status === "failed" || run.status === "blocked" ? 1 : 0,
    completion_rate:
      run.requested_responses > 0
        ? Math.round((responsesGenerated / run.requested_responses) * 100)
        : 0,
    sentiment_distribution: [
      { label: "Positive", value: 52 },
      { label: "Neutral", value: 33 },
      { label: "Negative", value: 15 },
    ],
  };
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

export async function getSimulationRuns(
  limit = 20,
  offset = 0,
): Promise<PaginatedResponse<SimulationRun>> {
  const response = await getRequest<ApiResponse<PaginatedResponse<SimulationRunApiModel>>>(
    `${API_ENDPOINTS.simulation.runs}?limit=${limit}&offset=${offset}`,
  );
  return {
    ...response.data,
    results: response.data.results.map(mapRun),
  };
}

export async function createSimulationRun(
  payload: CreateSimulationRunPayload,
): Promise<SimulationRun> {
  const response = await postRequest<
    ApiResponse<SimulationRunApiModel>,
    Omit<CreateSimulationRunPayload, "persona_ids" | "generation_mode">
  >(API_ENDPOINTS.simulation.runs, {
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
      // personas array is already in payload.metadata (set by simulation-config-form)
    },
  });
  return mapRun(response.data);
}

/**
 * Trigger synchronous AI execution for a pending run (user-authenticated).
 * Calls POST /simulation/runs/<id>/execute/ which invokes GeminiSimulationService.
 */
export async function executeSimulationRun(id: string): Promise<SimulationRun> {
  const response = await postRequest<ApiResponse<SimulationRunApiModel>, Record<string, never>>(
    API_ENDPOINTS.simulation.runExecute(id),
    {},
  );
  return mapRun(response.data);
}

/**
 * Fetch AI-generated results for a completed simulation run.
 * Returns GET /simulation/runs/<id>/results/
 */
export async function getSimulationResults(
  id: string,
): Promise<SimulationResultsApiModel> {
  const response = await getRequest<ApiResponse<SimulationResultsApiModel>>(
    API_ENDPOINTS.simulation.runResults(id),
  );
  return response.data;
}

export async function getSimulationRunDetails(id: string): Promise<{
  run: SimulationRun;
  events: SimulationEvent[];
  responses: SyntheticResponsePreview[];
  metrics: SimulationMetrics;
}> {
  // 1. Fetch the run (includes events)
  const runResponse = await getRequest<ApiResponse<SimulationRunApiModel>>(
    API_ENDPOINTS.simulation.runDetail(id),
  );
  const run = mapRun(runResponse.data);
  const events = eventFromRun(runResponse.data);

  // 2. For completed runs, fetch real AI-generated results
  if (run.status === "completed") {
    try {
      const results = await getSimulationResults(id);
      return {
        run,
        events,
        responses: flattenResults(results),
        metrics: buildMetrics(run, results.generated_records),
      };
    } catch {
      // Results endpoint not available yet — return run with empty responses
    }
  }

  // Pending / running / failed: no responses yet
  return {
    run,
    events,
    responses: [],
    metrics: buildMetrics(run, 0),
  };
}
