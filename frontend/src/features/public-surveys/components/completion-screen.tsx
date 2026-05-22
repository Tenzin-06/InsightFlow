import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { SurveyContainer } from "./survey-container";

interface CompletionScreenProps {
  surveyTitle: string;
}

/**
 * Shown after a successful survey submission.
 * Provides positive confirmation and a clear return path.
 */
export function CompletionScreen({ surveyTitle }: CompletionScreenProps) {
  return (
    <SurveyContainer>
      <div className="rounded-xl bg-bg-secondary px-8 py-12 text-center shadow-sm">
        {/* Success icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-8 w-8 text-success" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold text-text-primary">Thank you!</h1>

        <p className="mt-2 text-text-secondary">
          Your response to{" "}
          <span className="font-medium text-text-primary">{surveyTitle}</span>{" "}
          has been submitted successfully.
        </p>

        <p className="mt-1 text-sm text-text-muted">
          Your feedback helps create better insights.
        </p>

        {/* Primary action */}
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>

      {/* Branding */}
      <footer className="mt-8 pb-4 text-center text-xs text-text-muted">
        Powered by{" "}
        <span className="font-semibold text-primary-500">InsightFlow</span>
      </footer>
    </SurveyContainer>
  );
}
