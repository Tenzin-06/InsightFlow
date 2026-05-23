/**
 * Conversational Survey API Service
 *
 * Thin re-export of the public survey API so this feature remains self-contained
 * and can be adapted independently in the future (e.g. AI-assisted endpoints).
 *
 * Endpoints used:
 *  GET  /api/v1/public/surveys/{id}/        — fetch published survey + questions
 *  POST /api/v1/public/surveys/{id}/submit/ — persist respondent answers
 */
export {
  getPublicSurvey,
  submitSurvey,
} from "@/features/public-surveys/services/public-survey-api";
