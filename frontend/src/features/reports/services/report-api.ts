/**
 * report-api.ts — Centralized API layer for report metadata.
 * Currently uses mock data; wire to real endpoints when backend is ready.
 */

import type { ExportRecord } from "../types";
import { MOCK_RECENT_EXPORTS } from "../constants";

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
