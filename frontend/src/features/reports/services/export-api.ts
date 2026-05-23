/**
 * export-api.ts — PDF export orchestration service.
 * Simulates async export lifecycle; wire to backend when ready.
 */

import type { ReportConfig, ExportStatus } from "../types";

export type InitiateExportResult = {
  exportId: string;
  status: ExportStatus;
};

export type ExportStatusResult = {
  exportId: string;
  status: ExportStatus;
  fileUrl?: string;
  errorMessage?: string;
};

const EXPORT_STAGES: ExportStatus[] = [
  "preparing",
  "rendering",
  "processing_charts",
  "finalizing",
  "completed",
];

export async function initiateExport(config: ReportConfig): Promise<InitiateExportResult> {
  if (!config.title.trim()) {
    throw new Error("Report title is required before exporting.");
  }
  if (config.sections.length === 0) {
    throw new Error("At least one section must be selected.");
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { exportId: `export-${Date.now()}`, status: "preparing" };
}

export async function pollExportStatus(
  exportId: string,
  currentStatus: ExportStatus
): Promise<ExportStatusResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const currentIndex = EXPORT_STAGES.indexOf(currentStatus as (typeof EXPORT_STAGES)[number]);
  if (currentIndex === -1 || currentIndex >= EXPORT_STAGES.length - 1) {
    return { exportId, status: "completed", fileUrl: "#simulated-download" };
  }
  const nextStatus = EXPORT_STAGES[currentIndex + 1];
  return {
    exportId,
    status: nextStatus,
    fileUrl: nextStatus === "completed" ? "#simulated-download" : undefined,
  };
}
