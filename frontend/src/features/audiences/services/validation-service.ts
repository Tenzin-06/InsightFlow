/**
 * validation-service.ts
 *
 * Client-side contact validation.  Mirrors the backend validation_service.py
 * rules so users get immediate feedback before any network request is made.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns true when the email string passes format validation. */
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim().toLowerCase());
}

/**
 * Validate a single contact row.
 *
 * Returns null on success, or an error message string on failure.
 */
export function validateContactRow(row: {
  email?: string;
  first_name?: string;
  last_name?: string;
}): string | null {
  const email = (row.email ?? "").trim();

  if (!email) return "Email is required.";
  if (!isValidEmail(email)) return `Invalid email format: ${email}`;

  return null;
}

/**
 * Validate an array of contact rows.
 *
 * Returns an object with:
 *   - valid    — rows that passed validation (email trimmed + lowercased)
 *   - invalid  — error messages per row
 *   - hasDuplicates — true when the batch contains duplicate emails
 */
export function validateContactBatch(
  rows: Array<{ email?: string; first_name?: string; last_name?: string }>
): {
  valid: Array<{ email: string; first_name?: string; last_name?: string }>;
  invalid: Array<{ rowNumber: number; message: string }>;
  hasDuplicates: boolean;
} {
  const valid: Array<{ email: string; first_name?: string; last_name?: string }> = [];
  const invalid: Array<{ rowNumber: number; message: string }> = [];
  const seen = new Set<string>();
  let hasDuplicates = false;

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // 1-indexed, row 1 = header
    const error = validateContactRow(row);

    if (error) {
      invalid.push({ rowNumber, message: error });
      return;
    }

    const email = (row.email ?? "").trim().toLowerCase();
    if (seen.has(email)) {
      hasDuplicates = true;
      invalid.push({ rowNumber, message: `Duplicate email in batch: ${email}` });
      return;
    }

    seen.add(email);
    valid.push({
      email,
      first_name: (row.first_name ?? "").trim() || undefined,
      last_name: (row.last_name ?? "").trim() || undefined,
    });
  });

  return { valid, invalid, hasDuplicates };
}
