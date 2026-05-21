import { Moon, Sun, Bell, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { UserNav } from "@/components/layout/user-nav";
import { allDashboardRoutes } from "@/routes/route-config";

function usePageTitle(): string {
  const location = useLocation();
  const route = allDashboardRoutes.find((r) => location.pathname.startsWith(r.path));
  return route?.label ?? "Dashboard";
}

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const pageTitle = usePageTitle();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-default bg-bg-secondary px-4 md:px-6">
      <div className="flex items-center gap-3">
        <MobileSidebar />
        <h1 className="text-base font-semibold text-text-primary md:text-lg">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Search"
          className="hidden sm:inline-flex"
        >
          <Search className="h-4 w-4 text-text-secondary" />
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4 text-text-secondary" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-text-secondary" />
          ) : (
            <Moon className="h-4 w-4 text-text-secondary" />
          )}
        </Button>

        <div className="ml-1">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
