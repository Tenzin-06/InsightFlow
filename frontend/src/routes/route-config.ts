import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Send,
  Settings,
  Users,
  LineChart,
  Megaphone,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type RouteConfig = {
  label: string;
  path: string;
  icon: LucideIcon;
  children?: RouteConfig[];
};

export const mainNavRoutes: RouteConfig[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Surveys", path: "/surveys", icon: ClipboardList },
  { label: "Audiences", path: "/dashboard/audiences", icon: Users },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    children: [
      { label: "Overview", path: "/analytics", icon: BarChart3 },
      { label: "Surveys", path: "/dashboard/analytics/surveys/1", icon: LineChart },
      { label: "Campaigns", path: "/dashboard/analytics/campaigns/1", icon: Megaphone },
      { label: "Engagement", path: "/dashboard/analytics/engagement", icon: Activity },
    ],
  },
  { label: "Campaigns", path: "/dashboard/campaigns", icon: Send },
];

export const settingsRoute: RouteConfig = {
  label: "Settings",
  path: "/settings",
  icon: Settings,
};

export const allDashboardRoutes: RouteConfig[] = [...mainNavRoutes, settingsRoute];
