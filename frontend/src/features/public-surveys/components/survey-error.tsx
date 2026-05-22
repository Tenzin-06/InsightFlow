import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { SurveyContainer } from "./survey-container";

interface SurveyErrorProps {
  error?: { message?: string; status?: number } | null;
  onRetry?: () => void;
}

function resolveErrorMessage(error?: { message?: string; status?: number } | null): string {
  if (!error) return "Unable to load survey. Please try again.";
  if (error.status === 404) return "This survey does not exist.";
  if (error.status === 403 || error.status === 400)
    return "This survey is currently unavailable.";
  return "Unable to load survey. Please check your connection and try again.";
}

/**
 * Graceful error state for unavailable or missing surveys.
 * Offers both a retry action and a return-home escape.
 */
export function SurveyError({ error, onRetry }: SurveyErrorProps) {
  const message = resolveErrorMessage(error);

  return (
    <SurveyContainer>
      <div className="rounded-xl bg-bg-secondary px-8 py-12 text-center shadow-sm">
        {/* Error icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
          <AlertCircle className="h-8 w-8 text-danger" aria-hidden="true" />
        </div>

        <h1 className="text-xl font-bold text-text-primary">Something went wrong</h1>
        <p className="mt-2 text-sm text-text-secondary">{message}</p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {onRetry && (
            <Button variant="default" onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try Again
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link to="/" className="gap-2 flex items-center">
              <Home className="h-4 w-4" aria-hidden="true" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>

      <footer className="mt-8 pb-4 text-center text-xs text-text-muted">
        Powered by{" "}
        <span className="font-semibold text-primary-500">InsightFlow</span>
      </footer>
    </SurveyContainer>
  );
}
