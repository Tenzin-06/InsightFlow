/**
 * report-api.ts — Report feature API layer.
 *
 * generateReportPreview()  — calls GET /api/v1/reports/preview/<surveyId>/
 *                            Returns a Gemini-generated JSON payload with
 *                            real metrics, chart data, AI insights, etc.
 *
 * getRecentExports()       — placeholder; wire to a real endpoint when the
 *                            export history backend is ready.
 */

import { apiClient } from "@/lib/api/client";
import type { ExportRecord, GeneratedReportData } from "../types";
import { MOCK_RECENT_EXPORTS } from "../constants";

// ─── Dynamic AI report generation ────────────────────────────────────────────

/**
 * Request a Gemini-generated report preview payload for a survey.
 *
 * @param surveyId   Numeric survey ID (as string, as stored in ReportConfig).
 * @param includeAi  When false the backend skips Gemini and AI analytics.
 *                   The caller still gets real metrics and chart data.
 */
export async function generateReportPreview(
  surveyId: string,
  includeAi: boolean = true,
): Promise<GeneratedReportData> {
  const params = new URLSearchParams({
    include_ai: includeAi ? "true" : "false",
  });

  const response = await apiClient.get<{ data: GeneratedReportData }>(
    `/reports/preview/${surveyId}/?${params.toString()}`,
  );

  // The Django backend wraps data in { data: ... } via success_response()
  return response.data.data;
}

// ─── Export history (still mocked — wire when backend endpoint exists) ────────

function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getRecentExports(): Promise<ExportRecord[]> {
  await delay();
  return MOCK_RECENT_EXPORTS;
}

export async function getExportById(id: string): Promise<ExportRecord | null> {
  await delay(200);
  return MOCK_RECENT_EXPORTS.find((e) => e.id === id) ?? null;
}
