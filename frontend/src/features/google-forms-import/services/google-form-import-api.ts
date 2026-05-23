import { postRequest } from "@/lib/api/utils";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api/types";
import type {
  GoogleFormImportPayload,
  ImportResult,
} from "@/features/google-forms-import/types";

/**
 * Submit a Google Forms URL for import.
 * POST /api/v1/surveys/import/google/
 * Returns the newly-created InsightFlow survey.
 */
export async function importGoogleForm(
  payload: GoogleFormImportPayload
): Promise<ImportResult> {
  const res = await postRequest<ApiResponse<ImportResult>, GoogleFormImportPayload>(
    API_ENDPOINTS.googleFormsImport.import,
    payload
  );
  return res.data;
}
