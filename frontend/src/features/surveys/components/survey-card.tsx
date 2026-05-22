import { MoreHorizontal, Pencil, Eye, Trash2, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SurveyStatusBadge } from "./survey-status-badge";
import type { Survey } from "@/features/surveys/types";

type Props = {
  survey: Survey;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SurveyCard({ survey, onDelete, onPublish }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <SurveyStatusBadge status={survey.status} />
            </div>
            <h3 className="truncate text-base font-semibold text-text-primary">
              {survey.title}
            </h3>
            {survey.description && (
              <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                {survey.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/surveys/${survey.id}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/surveys/${survey.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              {survey.status === "draft" && (
                <DropdownMenuItem onClick={() => onPublish(survey.id)}>
                  <Globe className="mr-2 h-4 w-4" />
                  Publish
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(survey.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
          <span>{survey.question_count} question{survey.question_count !== 1 ? "s" : ""}</span>
          <span>·</span>
          <span>Updated {formatDate(survey.updated_at)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
