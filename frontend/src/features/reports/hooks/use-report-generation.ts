/**
 * use-report-generation.ts
 *
 * Manages the lifecycle of a Gemini-powered report generation request.
 *
 * Usage:
 *   const { reportData, isGenerating, error, generate, reset } =
 *     useReportGeneration(config.surveyId, config.includeAiInsights);
 *
 *   // Trigger generation:
 *   <button onClick={generate}>Generate Report</button>
 *
 *   // Pass real data to layout:
 *   <ReportLayout config={config} reportData={reportData} />
 */

import { useState, useCallback } from "react";
import { generateReportPreview } from "@/features/reports/services/report-api";
import type { GeneratedReportData } from "@/features/reports/types";

export type ReportGenerationState =
  | "idle"
  | "generating"
  | "ready"
  | "error";

export function useReportGeneration(
  surveyId: string | undefined,
  includeAi: boolean,
) {
  const [reportData, setReportData] = useState<GeneratedReportData | null>(null);
  const [genState, setGenState] = useState<ReportGenerationState>("idle");
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!surveyId) {
      setError("Please select a survey before generating the report.");
      return;
    }

    setGenState("generating");
    setError(null);

    try {
      const data = await generateReportPreview(surveyId, includeAi);
      setReportData(data);
      setGenState("ready");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to generate report. Please try again.";
      setError(message);
      setGenState("error");
    }
  }, [surveyId, includeAi]);

  const reset = useCallback(() => {
    setReportData(null);
    setGenState("idle");
    setError(null);
  }, []);

  return {
    /** Generated report data — null until generate() completes successfully. */
    reportData,
    /** True while waiting for the backend / Gemini response. */
    isGenerating: genState === "generating",
    /** True after a successful generation. */
    isReady: genState === "ready",
    /** Error message, or null. */
    error,
    /** Current state machine value. */
    genState,
    /** Trigger generation. No-op if surveyId is empty. */
    generate,
    /** Clear generated data and reset to idle. */
    reset,
  };
}
