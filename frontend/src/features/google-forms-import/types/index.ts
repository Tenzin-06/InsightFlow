export type ImportStatus =
  | "idle"
  | "validating"
  | "importing"
  | "success"
  | "error";

export type ImportErrorCode =
  | "INVALID_URL"
  | "PARSING_FAILED"
  | "NETWORK_ERROR"
  | "UNAUTHORIZED_ACCESS"
  | "UNSUPPORTED_FORM"
  | "UNKNOWN";

export type ImportError = {
  code: ImportErrorCode;
  message: string;
};

export type ImportedSurvey = {
  id: string;
  title: string;
  question_count: number;
};

export type ImportResult = {
  survey: ImportedSurvey;
};

export type GoogleFormImportPayload = {
  url: string;
};

export type ImportFormValues = {
  url: string;
};
