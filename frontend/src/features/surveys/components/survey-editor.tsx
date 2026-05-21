import { useState, useEffect, useRef, type RefObject } from "react";
import { Plus } from "lucide-react";
import { InlineQuestionCard } from "./inline-question-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from "@/features/surveys/hooks/use-questions";
import type { UpdateQuestionPayload } from "@/features/surveys/types";

type Props = {
  surveyId: string;
  onAddRef?: RefObject<(() => void) | null>;
};

export function SurveyEditor({ surveyId, onAddRef }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const autoCreated = useRef(false);

  const { data: questions = [], isLoading } = useQuestions(surveyId);
  const createQuestion = useCreateQuestion(surveyId);
  const updateQuestion = useUpdateQuestion(surveyId);
  const deleteQuestion = useDeleteQuestion(surveyId);

  const sorted = [...questions].sort((a, b) => a.order - b.order);

  // Expose handleAddQuestion to the parent toolbar via ref
  useEffect(() => {
    if (onAddRef) onAddRef.current = handleAddQuestion;
  });

  // Auto-create the first question when a brand-new survey opens empty
  useEffect(() => {
    if (!isLoading && sorted.length === 0 && !autoCreated.current && !createQuestion.isPending) {
      autoCreated.current = true;
      createQuestion.mutate(
        {
          question_text: "Untitled Question",
          question_type: "multiple_choice",
          is_required: false,
          order: 1,
          metadata: { choices: ["Option 1"] },
        },
        { onSuccess: (q) => setActiveId(q.id) }
      );
    }
  }, [isLoading, sorted.length]);

  function handleAddQuestion() {
    if (createQuestion.isPending) return;
    createQuestion.mutate(
      {
        question_text: "Untitled Question",
        question_type: "multiple_choice",
        is_required: false,
        order: sorted.length + 1,
        metadata: { choices: ["Option 1"] },
      },
      { onSuccess: (q) => setActiveId(q.id) }
    );
  }

  function handleSave(questionId: string, payload: UpdateQuestionPayload) {
    updateQuestion.mutate({ id: questionId, payload });
  }

  function handleMoveUp(id: string) {
    const idx = sorted.findIndex((q) => q.id === id);
    if (idx <= 0) return;
    const prev = sorted[idx - 1];
    updateQuestion.mutate({ id, payload: { order: prev.order } });
    updateQuestion.mutate({ id: prev.id, payload: { order: sorted[idx].order } });
  }

  function handleMoveDown(id: string) {
    const idx = sorted.findIndex((q) => q.id === id);
    if (idx >= sorted.length - 1) return;
    const next = sorted[idx + 1];
    updateQuestion.mutate({ id, payload: { order: next.order } });
    updateQuestion.mutate({ id: next.id, payload: { order: sorted[idx].order } });
  }

  if (isLoading || (sorted.length === 0 && createQuestion.isPending)) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <section aria-label="Survey questions" className="space-y-3">
      {sorted.map((question, idx) => (
        <InlineQuestionCard
          key={question.id}
          question={question}
          index={idx}
          isFirst={idx === 0}
          isLast={idx === sorted.length - 1}
          isActive={activeId === question.id}
          onActivate={() => setActiveId(question.id)}
          onSave={(payload) => handleSave(question.id, payload)}
          onDelete={() => {
            deleteQuestion.mutate(question.id);
            if (activeId === question.id) setActiveId(null);
          }}
          onMoveUp={() => handleMoveUp(question.id)}
          onMoveDown={() => handleMoveDown(question.id)}
        />
      ))}

      {/* Inline add button at bottom of question list */}
      <button
        type="button"
        onClick={handleAddQuestion}
        disabled={createQuestion.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-white/50 py-3 text-sm text-text-muted transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 disabled:opacity-50 dark:bg-card/50"
      >
        <Plus className="h-4 w-4" />
        {createQuestion.isPending ? "Adding…" : "Add question"}
      </button>
    </section>
  );
}
