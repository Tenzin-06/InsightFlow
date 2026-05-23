import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PublicLayout from "@/app/layouts/public-layout";
import DashboardLayout from "@/app/layouts/dashboard-layout";
import AuthenticationLayout from "@/features/auth/layouts/authentication-layout";
import { ProtectedRoute } from "@/routes/protected-route";

const LandingPage = lazy(() => import("@/features/marketing/pages/landing-page"));
const PublicSurveyPage = lazy(() => import("@/features/public-surveys/pages/public-survey-page"));
const ConversationalSurveyPage = lazy(() => import("@/features/conversational-surveys/pages/conversational-survey-page"));
const LoginPage = lazy(() => import("@/features/auth/pages/login-page"));
const RegisterPage = lazy(() => import("@/features/auth/pages/register-page"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/dashboard-page"));
const SurveyListPage = lazy(() => import("@/features/surveys/pages/survey-list-page"));
const SurveyCreatePage = lazy(() => import("@/features/surveys/pages/survey-create-page"));
const SurveyDetailPage = lazy(() => import("@/features/surveys/pages/survey-detail-page"));
const SurveyEditorPage = lazy(() => import("@/features/surveys/pages/survey-editor-page"));
const AudiencesPage = lazy(() => import("@/features/audiences/pages/audiences-page"));
const AudienceDetailPage = lazy(() => import("@/features/audiences/pages/audience-detail-page"));
const AudienceFormPage = lazy(() => import("@/features/audiences/pages/audience-form-page"));
const AnalyticsPage = lazy(() => import("@/features/analytics/pages/analytics-page"));
const SurveyAnalyticsPage = lazy(() => import("@/features/analytics/pages/survey-analytics-page"));
const CampaignAnalyticsPage = lazy(() => import("@/features/analytics/pages/campaign-analytics-page"));
const EngagementAnalyticsPage = lazy(() => import("@/features/analytics/pages/engagement-analytics-page"));
const CampaignsPage = lazy(() => import("@/features/email-campaigns/pages/campaigns-page"));
const CreateCampaignPage = lazy(() => import("@/features/email-campaigns/pages/create-campaign-page"));
const CampaignDetailPage = lazy(() => import("@/features/email-campaigns/pages/campaign-detail-page"));
const SettingsPage = lazy(() => import("@/features/dashboard/pages/settings-page"));
const SimulationPage = lazy(() => import("@/features/simulation/pages/simulation-page"));
const SimulationPersonasPage = lazy(() => import("@/features/simulation/pages/simulation-personas-page"));
const SimulationRunsPage = lazy(() => import("@/features/simulation/pages/simulation-runs-page"));
const SimulationAnalyticsPage = lazy(() => import("@/features/simulation/pages/simulation-analytics-page"));
const ReportsPage = lazy(() => import("@/features/reports/pages/reports-page"));

const PageLoader = () => (
  <div role="status" aria-live="polite" className="flex h-screen items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" aria-hidden="true" />
    <span className="sr-only">Loading…</span>
  </div>
);

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense> },
      // Conversational (chat) survey — must be before /s/:surveyId to match first
      { path: "/s/:surveyId/chat", element: <Suspense fallback={<PageLoader />}><ConversationalSurveyPage /></Suspense> },
      // Standard public survey participation — no authentication required
      { path: "/s/:surveyId", element: <Suspense fallback={<PageLoader />}><PublicSurveyPage /></Suspense> },
    ],
  },
  {
    element: <AuthenticationLayout />,
    children: [
      { path: "/login", element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: "/register", element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
          { path: "/surveys", element: <Suspense fallback={<PageLoader />}><SurveyListPage /></Suspense> },
          { path: "/surveys/create", element: <Suspense fallback={<PageLoader />}><SurveyCreatePage /></Suspense> },
          { path: "/surveys/:surveyId", element: <Suspense fallback={<PageLoader />}><SurveyDetailPage /></Suspense> },
          { path: "/surveys/:surveyId/edit", element: <Suspense fallback={<PageLoader />}><SurveyEditorPage /></Suspense> },
          { path: "/dashboard/audiences", element: <Suspense fallback={<PageLoader />}><AudiencesPage /></Suspense> },
          { path: "/dashboard/audiences/new", element: <Suspense fallback={<PageLoader />}><AudienceFormPage mode="create" /></Suspense> },
          { path: "/dashboard/audiences/:audienceId", element: <Suspense fallback={<PageLoader />}><AudienceDetailPage /></Suspense> },
          { path: "/dashboard/audiences/:audienceId/edit", element: <Suspense fallback={<PageLoader />}><AudienceFormPage mode="edit" /></Suspense> },
          { path: "/analytics", element: <Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense> },
          { path: "/dashboard/analytics/surveys/:surveyId", element: <Suspense fallback={<PageLoader />}><SurveyAnalyticsPage /></Suspense> },
          { path: "/dashboard/analytics/campaigns/:campaignId", element: <Suspense fallback={<PageLoader />}><CampaignAnalyticsPage /></Suspense> },
          { path: "/dashboard/analytics/engagement", element: <Suspense fallback={<PageLoader />}><EngagementAnalyticsPage /></Suspense> },
          { path: "/dashboard/campaigns", element: <Suspense fallback={<PageLoader />}><CampaignsPage /></Suspense> },
          { path: "/dashboard/campaigns/new", element: <Suspense fallback={<PageLoader />}><CreateCampaignPage /></Suspense> },
          { path: "/dashboard/campaigns/:campaignId", element: <Suspense fallback={<PageLoader />}><CampaignDetailPage /></Suspense> },
          { path: "/dashboard/simulation", element: <Suspense fallback={<PageLoader />}><SimulationPage /></Suspense> },
          { path: "/dashboard/simulation/personas", element: <Suspense fallback={<PageLoader />}><SimulationPersonasPage /></Suspense> },
          { path: "/dashboard/simulation/runs", element: <Suspense fallback={<PageLoader />}><SimulationRunsPage /></Suspense> },
          { path: "/dashboard/simulation/analytics", element: <Suspense fallback={<PageLoader />}><SimulationAnalyticsPage /></Suspense> },
          { path: "/dashboard/reports", element: <Suspense fallback={<PageLoader />}><ReportsPage /></Suspense> },
          { path: "/settings", element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
