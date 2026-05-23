import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import { SimulationBanner } from "@/features/simulation/components/simulation-banner";

const NAV_ITEMS = [
  { label: "Workspace", path: "/dashboard/simulation" },
  { label: "Personas", path: "/dashboard/simulation/personas" },
  { label: "Runs", path: "/dashboard/simulation/runs" },
  { label: "Analytics", path: "/dashboard/simulation/analytics" },
];

type SimulationShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  sidePanel?: ReactNode;
};

export function SimulationShell({ title, subtitle, children, sidePanel }: SimulationShellProps) {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <SimulationBanner />

      <header className="rounded-lg border border-orange-200 bg-orange-100/60 p-5">
        <h1 className="text-2xl font-bold text-orange-900">{title}</h1>
        <p className="mt-1 text-sm text-orange-800">{subtitle}</p>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Simulation navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={[
                "rounded-md border px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "border-orange-300 bg-orange-500 text-white"
                  : "border-border-default bg-bg-secondary text-text-secondary hover:border-orange-300 hover:text-orange-800",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <section className="space-y-6 xl:col-span-3">{children}</section>
        <aside className="space-y-4 xl:col-span-1">{sidePanel}</aside>
      </div>
    </div>
  );
}

