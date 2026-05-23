import * as dotenv from "dotenv";

dotenv.config();

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000";
const TRIGGER_INTERNAL_SECRET = process.env.TRIGGER_INTERNAL_SECRET || "";

/**
 * Standard API result shape returned by Django.
 */
export type ApiResult = {
  success: boolean;
  data?: Record<string, unknown>;
  error?: { code: string; message: string };
};

/**
 * Make an authenticated request to the Django internal API.
 *
 * Workers authenticate using the shared TRIGGER_INTERNAL_SECRET.
 * Only minimal identifiers are passed — Django fetches the full resource.
 *
 * @param path     - Django URL path (e.g. "/api/v1/internal/campaigns/1/process/")
 * @param method   - HTTP verb (defaults to POST)
 * @param body     - Optional JSON body
 */
export async function callDjangoApi(
  path: string,
  method: "GET" | "POST" | "PATCH" = "POST",
  body?: Record<string, unknown>
): Promise<ApiResult> {
  if (!TRIGGER_INTERNAL_SECRET) {
    throw new Error(
      "TRIGGER_INTERNAL_SECRET is not configured. " +
        "Set this in /backend/trigger/.env to allow worker → Django communication."
    );
  }

  const url = `${DJANGO_API_URL}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Trigger-Internal-Secret": TRIGGER_INTERNAL_SECRET,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json()) as ApiResult;

  if (!response.ok) {
    throw new Error(
      `Django API error ${response.status} on ${method} ${path}: ` +
        JSON.stringify(data?.error ?? data)
    );
  }

  return data;
}
