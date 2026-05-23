import { GOOGLE_FORMS_URL_PATTERN } from "@/features/google-forms-import/constants";
import type { ImportErrorCode } from "@/features/google-forms-import/types";

/** Returns true if the URL matches the Google Forms structure. */
export function isGoogleFormsUrl(url: string): boolean {
  return GOOGLE_FORMS_URL_PATTERN.test(url.trim());
}

/** Map an API error status/message to a typed ImportErrorCode. */
export function classifyImportError(error: unknown): ImportErrorCode {
  if (!error || typeof error !== "object") return "UNKNOWN";
  const e = error as { response?: { status?: number; data?: { error?: { code?: string } } } };
  const status = e.response?.status;
  const code = e.response?.data?.error?.code;

  if (code === "INVALID_URL" || code === "UNSUPPORTED_FORM") return code;
  if (code === "PARSING_FAILED") return "PARSING_FAILED";
  if (code === "UNAUTHORIZED_ACCESS" || status === 403) return "UNAUTHORIZED_ACCESS";
  if (!status || status === 0 || status === 503) return "NETWORK_ERROR";
  return "UNKNOWN";
}

/** Sanitize a user-pasted URL (trim whitespace). */
export function sanitizeUrl(url: string): string {
  return url.trim();
}
