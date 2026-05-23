import { CheckCircle2, PenSquare, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { ImportedSurvey } from "@/features/google-forms-import/types";

type Props = {
  survey: ImportedSurvey;
  onClose: () => void;
};

export function ImportSuccess({ survey, onClose }: Props) {
  const navigate = useNavigate();

  function handleOpenEditor() {
    onClose();
    navigate(`/surveys/${survey.id}/edit`);
  }

  function handleBackToSurveys() {
    onClose();
    navigate("/surveys");
  }

  return (
    <div
      className="flex flex-col items-center gap-5 py-4 text-center"
      role="status"
      aria-live="polite"
    >
      {/* Success icon */}
      <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
        <CheckCircle2
          className="h-8 w-8 text-green-600 dark:text-green-400"
          aria-hidden="true"
        />
      </div>

      {/* Message */}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-text-primary">
          Import Successful!
        </h3>
        <p className="text-sm text-text-secondary">
          <span className="font-medium">{survey.title}</span> was imported with{" "}
          <span className="font-medium">{survey.question_count}</span>{" "}
          {survey.question_count === 1 ? "question" : "questions"}.
        </p>
      </div>

      {/* Actions */}
      <div className="w-full space-y-2">
        <Button
          onClick={handleOpenEditor}
          className="w-full gap-2 bg-primary-500 hover:bg-primary-600"
        >
          <PenSquare className="h-4 w-4" aria-hidden="true" />
          Open Survey Editor
        </Button>
        <Button
          onClick={handleBackToSurveys}
          variant="outline"
          className="w-full gap-2"
        >
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          Back to Surveys
        </Button>
      </div>
    </div>
  );
}
