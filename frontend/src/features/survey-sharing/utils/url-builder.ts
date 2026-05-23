import { APP_BASE_URL } from "../constants";

export function generateSurveyShareLink(slug: string): string {
  return `${APP_BASE_URL}/s/${slug}`;
}

export function generateConversationalShareLink(slug: string): string {
  return `${APP_BASE_URL}/s/${slug}/chat`;
}
