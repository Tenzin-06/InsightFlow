/**
 * upload-utils.ts
 *
 * Helper utilities for upload state, UI messages, and file validation.
 */

import type { UploadSummary, ContactUploadDraft } from "@/features/audiences/types";

/** Max CSV file size accepted client-side (10 MB). */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Accepted MIME types for CSV uploads. */
export const ACCEPTED_MIME_TYPES = ["text/csv", "text/plain", "application/csv"] as const;

/**
 * Returns true when a File is a valid CSV upload candidate.
 * Checks both MIME type and file extension as a fallback.
 */
export function isAcceptedCsvFile(file: File): boolean {
  const byMime = (ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type);
  const byExtension = file.name.toLowerCase().endsWith(".csv");
  return byMime || byExtension;
}

/**
 * Returns true when the file is within the size limit.
 */
export function isWithinSizeLimit(file: File): boolean {
  return file.size <= MAX_UPLOAD_BYTES;
}

/**
 * Human-readable upload summary message.
 * e.g. "120 contacts imported · 4 duplicates skipped · 2 invalid rows"
 */
export function formatUploadSummary(summary: UploadSummary): string {
  const parts: string[] = [];
  if (summary.uploaded > 0) {
    parts.push(`${summary.uploaded} contact${summary.uploaded === 1 ? "" : "s"} imported`);
  }
  if (summary.duplicates > 0) {
    parts.push(`${summary.duplicates} duplicate${summary.duplicates === 1 ? "" : "s"} skipped`);
  }
  if (summary.invalid > 0) {
    parts.push(`${summary.invalid} invalid row${summary.invalid === 1 ? "" : "s"}`);
  }
  return parts.join(" · ") || "No contacts processed";
}

/**
 * Counts ready-to-submit contacts in a draft.
 */
export function draftContactCount(draft: ContactUploadDraft | null): number {
  return draft?.contacts.length ?? 0;
}

/**
 * Returns true when a draft has at least one valid contact to submit.
 */
export function isDraftSubmittable(draft: ContactUploadDraft | null): boolean {
  return draftContactCount(draft) > 0;
}
