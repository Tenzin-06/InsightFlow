/**
 * upload-service.ts
 *
 * Orchestrates the full client-side upload workflow:
 *   1. Parse CSV file into a ContactUploadDraft
 *   2. Apply client-side validation via validation-service
 *   3. Submit valid contacts to the backend upload endpoint
 *   4. Return the server's UploadSummary
 *
 * Keeps parsing, validation, and API concerns separate so each layer can be
 * tested and reused independently.
 */

import { parseContactsFromCsv } from "@/features/audiences/utils/csv-parser";
import { validateContactBatch } from "@/features/audiences/services/validation-service";
import { uploadAudienceContacts } from "@/features/audiences/services/audience-api";
import type { ContactUploadDraft, UploadSummary } from "@/features/audiences/types";

/**
 * Parse a CSV File and return a ContactUploadDraft with valid contacts and
 * any row-level errors detected on the client.
 */
export async function parseUploadFile(file: File): Promise<ContactUploadDraft> {
  return parseContactsFromCsv(file);
}

/**
 * Submit a ContactUploadDraft to the backend.
 *
 * Only valid contacts (draft.contacts) are sent.  Returns the server's
 * UploadSummary which includes server-side deduplication results.
 */
export async function submitContactUpload(
  audienceId: string,
  draft: ContactUploadDraft
): Promise<UploadSummary> {
  const contacts = draft.contacts.map(({ email, first_name, last_name }) => ({
    email,
    first_name,
    last_name,
  }));

  return uploadAudienceContacts(audienceId, { contacts });
}

/**
 * Validate a raw contact list against client-side rules before submitting.
 * Wraps validation-service.validateContactBatch for convenience.
 */
export { validateContactBatch } from "@/features/audiences/services/validation-service";
