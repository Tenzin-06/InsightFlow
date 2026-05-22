import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onAddQuestion: () => void;
};

export function QuestionToolbar({ onAddQuestion }: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-dashed bg-muted/40 px-4 py-3">
      <p className="text-sm text-text-secondary">Add questions to build your survey</p>
      <Button
        onClick={onAddQuestion}
        size="sm"
        className="gap-1.5 bg-primary-500 hover:bg-primary-600"
      >
        <Plus className="h-4 w-4" />
        Add Question
      </Button>
    </div>
  );
}
