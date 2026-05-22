import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Question, QuestionType } from "@/features/surveys/types";

const questionTypeLabels: Record<QuestionType, string> = {
  short_text: "Short Text",
  long_text: "Long Text",
  multiple_choice: "Multiple Choice",
  checkbox: "Checkbox",
  rating: "Rating",
};

type Props = {
  question: Question;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
};

export function QuestionCard({
  question,
  index,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onMoveUp(question.id)}
          disabled={isFirst}
          aria-label="Move question up"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs font-medium text-text-muted">{index + 1}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onMoveDown(question.id)}
          disabled={isLast}
          aria-label="Move question down"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {questionTypeLabels[question.question_type]}
          </Badge>
          {question.is_required && (
            <Badge variant="warning" className="text-xs">
              Required
            </Badge>
          )}
        </div>
        <p className="mt-1.5 text-sm font-medium text-text-primary">
          {question.question_text || <span className="italic text-text-muted">Untitled question</span>}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(question)}
          aria-label="Edit question"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(question.id)}
          aria-label="Delete question"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
