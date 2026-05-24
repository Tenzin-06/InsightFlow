import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/api/utils";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api/types";

// Shape returned by GET /api/v1/analytics/dashboard/
export type DashboardAnalyticsData = {
  metrics: {
    total_surveys: number;
    total_responses: number;
    total_campaigns: number;
    total_emails_sent: number;
    overall_response_rate: number;
  };
  charts: {
    response_trend: { date: string; value: number }[];
    top_surveys: { survey_id: number; title: string; response_count: number }[];
  };
  trends: {
    response_trend: { date: string; value: number }[];
  };
  segments: {
    top_surveys: { survey_id: number; title: string; response_count: number }[];
  };
};

async function fetchDashboardAnalytics(): Promise<DashboardAnalyticsData> {
  const response = await getRequest<ApiResponse<DashboardAnalyticsData>>(
    API_ENDPOINTS.analytics.dashboard,
  );
  return response.data;
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["analytics", "dashboard"],
    queryFn: fetchDashboardAnalytics,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
}
