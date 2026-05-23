import { useMemo } from "react";
import { validateContactRow } from "@/features/audiences/services/validation-service";
import type { ContactUploadDraft, ContactUploadError } from "@/features/audiences/types";

/**
 * Derives live validation state from a ContactUploadDraft.
 *
 * Returns:
 *   - validCount    — number of contacts that passed validation
 *   - errors        — all validation errors from the draft
 *   - rowErrors     — only per-row errors (not structural CSV errors)
 *   - isValid       — true when there is at least one valid contact and no
 *                     structural (CSV-level) errors
 */
export function useContactValidation(draft: ContactUploadDraft | null) {
  return useMemo(() => {
    if (!draft) {
      return { validCount: 0, errors: [], rowErrors: [], isValid: false };
    }

    // Re-validate each contact row to surface any issues not caught client-side
    const rowErrors: ContactUploadError[] = draft.contacts
      .map((contact, index) => {
        const error = validateContactRow(contact);
        if (!error) return null;
        return { rowNumber: contact.rowNumber ?? index + 2, message: error };
      })
      .filter((e): e is ContactUploadError => e !== null);

    const allErrors = [...draft.errors, ...rowErrors];
    const csvErrors = allErrors.filter((e) => e.field === "csv");
    const isValid = draft.contacts.length > 0 && csvErrors.length === 0;

    return {
      validCount: draft.contacts.length,
      errors: allErrors,
      rowErrors,
      isValid,
    };
  }, [draft]);
}
