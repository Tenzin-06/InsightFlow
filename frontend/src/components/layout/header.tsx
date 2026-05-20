import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/navigation";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-default bg-bg-secondary px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
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
        <Navigation />
      </div>
    </header>
  );
}
