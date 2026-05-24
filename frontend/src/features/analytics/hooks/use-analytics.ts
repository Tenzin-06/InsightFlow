import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/api/utils";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api/types";

// ---------------------------------------------------------------------------
// Shared chart shapes (match backend serialiser output)
// ---------------------------------------------------------------------------

type TrendPoint = { date: string; value: number };
type FunnelStep = { label: string; value: number; percentage: number };

// ---------------------------------------------------------------------------
// Dashboard analytics  —  GET /api/v1/analytics/dashboard/
// ---------------------------------------------------------------------------

export type DashboardAnalyticsData = {
  metrics: {
    total_surveys: number;
    total_responses: number;
    total_campaigns: number;
    total_emails_sent: number;
    overall_response_rate: number;
  };
  charts: {
    response_trend: TrendPoint[];
    top_surveys: { survey_id: number; title: string; response_count: number }[];
  };
  trends: { response_trend: TrendPoint[] };
  segments: { top_surveys: { survey_id: number; title: string; response_count: number }[] };
};

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: async () => {
      const res = await getRequest<ApiResponse<DashboardAnalyticsData>>(
        API_ENDPOINTS.analytics.dashboard,
      );
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

// ---------------------------------------------------------------------------
// Engagement analytics  —  GET /api/v1/analytics/engagement/
// ---------------------------------------------------------------------------

export type EngagementAnalyticsData = {
  metrics: {
    total_sent: number;
    total_responses: number;
    total_campaigns: number;
    overall_response_rate: number;
  };
  charts: {
    funnel: FunnelStep[];
    drop_off: {
      survey_id: number;
      title: string;
      emails_sent: number;
      responses: number;
      response_rate: number;
      drop_off_rate: number;
    }[];
    timeline: TrendPoint[];
    segments: { label: string; value: number; fill: string | null }[];
  };
  funnel: FunnelStep[];
};

export function useEngagementAnalytics() {
  return useQuery({
    queryKey: ["analytics", "engagement"],
    queryFn: async () => {
      const res = await getRequest<ApiResponse<EngagementAnalyticsData>>(
        API_ENDPOINTS.analytics.engagement,
      );
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

// ---------------------------------------------------------------------------
// Survey analytics  —  GET /api/v1/analytics/surveys/<id>/
// ---------------------------------------------------------------------------

export type SurveyAnalyticsData = {
  metrics: {
    total_responses: number;
    completion_rate: number;
    drop_off_rate: number;
    question_count: number;
  };
  charts: {
    response_trend: TrendPoint[];
    question_engagement: {
      question_id: number;
      question_text: string;
      answer_count: number;
      engagement_rate: number;
      order: number;
    }[];
  };
  funnel: FunnelStep[];
};

export function useSurveyAnalytics(surveyId: string | undefined) {
  return useQuery({
    queryKey: ["analytics", "survey", surveyId],
    queryFn: async () => {
      const res = await getRequest<ApiResponse<SurveyAnalyticsData>>(
        API_ENDPOINTS.analytics.survey(surveyId!),
      );
      return res.data;
    },
    enabled: Boolean(surveyId),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

// ---------------------------------------------------------------------------
// Campaign analytics  —  GET /api/v1/analytics/campaigns/<id>/
// ---------------------------------------------------------------------------

export type CampaignAnalyticsData = {
  metrics: {
    emails_sent: number;
    emails_failed: number;
    delivery_rate: number;
    response_rate: number;
    total_responses: number;
  };
  charts: {
    delivery_trend: TrendPoint[];
  };
  funnel: FunnelStep[];
};

export function useCampaignAnalytics(campaignId: string | undefined) {
  return useQuery({
    queryKey: ["analytics", "campaign", campaignId],
    queryFn: async () => {
      const res = await getRequest<ApiResponse<CampaignAnalyticsData>>(
        API_ENDPOINTS.analytics.campaign(campaignId!),
      );
      return res.data;
    },
    enabled: Boolean(campaignId),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}
