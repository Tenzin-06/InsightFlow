import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SurveyStatusBadge } from "./survey-status-badge";
import type { SurveyStatus } from "@/features/surveys/types";

type Props = {
  title: string;
  status?: SurveyStatus;
  backTo?: string;
  actions?: React.ReactNode;
};

export function SurveyHeader({ title, status, backTo, actions }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {backTo && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(backTo)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-text-primary sm:text-2xl">{title}</h1>
            {status && <SurveyStatusBadge status={status} />}
          </div>
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
