import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PublicLayout from "@/app/layouts/public-layout";
import DashboardLayout from "@/app/layouts/dashboard-layout";
import AuthenticationLayout from "@/features/auth/layouts/authentication-layout";

import LandingPage from "@/features/dashboard/pages/landing-page";
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import DashboardPage from "@/features/dashboard/pages/dashboard-page";
import SurveysPage from "@/features/surveys/pages/surveys-page";
import AnalyticsPage from "@/features/analytics/pages/analytics-page";
import CampaignsPage from "@/features/campaigns/pages/campaigns-page";
import SettingsPage from "@/features/dashboard/pages/settings-page";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [{ path: "/", element: <LandingPage /> }],
  },
  {
    element: <AuthenticationLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/surveys", element: <SurveysPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
      { path: "/campaigns", element: <CampaignsPage /> },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
