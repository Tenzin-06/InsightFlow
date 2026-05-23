import { getAudiences } from "@/features/audiences/services/audience-api";
import { getSurveys } from "@/features/surveys/services/survey-api";
import type { CampaignOptionData } from "@/features/email-campaigns/types";

export async function getCampaignOptions(): Promise<CampaignOptionData> {
  const [surveys, audiences] = await Promise.all([getSurveys(), getAudiences()]);
  return { surveys, audiences };
}
