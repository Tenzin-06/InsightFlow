import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SurveyContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Centered, constrained wrapper for the entire public survey experience.
 * Mobile-first: full-width on small screens, max-w-2xl centered on larger.
 */
export function SurveyContainer({ children, className }: SurveyContainerProps) {
  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8 sm:px-6">
      <div className={cn("mx-auto w-full max-w-2xl", className)}>
        {children}
      </div>
    </div>
  );
}
