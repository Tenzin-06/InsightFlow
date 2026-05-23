import type { ImportErrorCode } from "@/features/google-forms-import/types";

export const GOOGLE_FORMS_URL_PATTERN =
  /^https:\/\/docs\.google\.com\/forms\/d\/[a-zA-Z0-9_-]+/;

export const IMPORT_STATUS_LABELS: Record<string, string> = {
  idle: "Ready",
  validating: "Validating",
  importing: "Importing",
  success: "Imported",
  error: "Failed",
};

export const IMPORT_LOADING_MESSAGES = [
  "Analyzing Google Form…",
  "Importing Questions…",
  "Preparing Survey Structure…",
];

export const IMPORT_ERROR_MESSAGES: Record<ImportErrorCode, string> = {
  INVALID_URL:
    "This doesn't look like a valid Google Forms URL. Please check the link and try again.",
  PARSING_FAILED:
    "We couldn't read the structure of this form. Make sure it's publicly accessible.",
  NETWORK_ERROR:
    "A connection issue was detected. Please check your network and retry.",
  UNAUTHORIZED_ACCESS:
    "This Google Form is not publicly accessible. Set the form to public before importing.",
  UNSUPPORTED_FORM:
    "This form contains unsupported question types and cannot be imported.",
  UNKNOWN: "Something went wrong. Please try again.",
};

export const IMPORT_ERROR_RECOVERY: Record<ImportErrorCode, string> = {
  INVALID_URL: "Enter a URL starting with https://docs.google.com/forms/",
  PARSING_FAILED: "Open the form in Google Forms and verify it is shared publicly.",
  NETWORK_ERROR: "Check your internet connection and click Retry.",
  UNAUTHORIZED_ACCESS:
    "In Google Forms, go to Settings → Responses and uncheck \"Limit to 1 response\", then share the link.",
  UNSUPPORTED_FORM: "Only text, multiple-choice, checkbox, and rating questions are supported.",
  UNKNOWN: "If the problem persists, try a different form.",
};
