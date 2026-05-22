import { useState, useEffect, useRef } from "react";
import {
  GripVertical,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Question, QuestionType, UpdateQuestionPayload } from "@/features/surveys/types";

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "short_text", label: "Short answer" },
  { value: "long_text", label: "Paragraph" },
  { value: "multiple_choice", label: "Multiple choice" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "rating", label: "Linear scale" },
];

type Props = {
  question: Question;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  onActivate: () => void;
  onSave: (payload: UpdateQuestionPayload) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

function RequiredToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        checked ? "bg-primary-500" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function InlineQuestionCard({
  question,
  index,
  isFirst,
  isLast,
  isActive,
  onActivate,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [localText, setLocalText] = useState(question.question_text);
  const [localType, setLocalType] = useState<QuestionType>(question.question_type);
  const [localRequired, setLocalRequired] = useState(question.is_required);
  const [localOptions, setLocalOptions] = useState<string[]>(
    () => (question.metadata?.choices as string[] | undefined) ?? ["Option 1"]
  );

  const optionsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when a different question is mounted (id change)
  useEffect(() => {
    setLocalText(question.question_text);
    setLocalType(question.question_type);
    setLocalRequired(question.is_required);
    setLocalOptions((question.metadata?.choices as string[] | undefined) ?? ["Option 1"]);
  }, [question.id]);

  // Debounced text save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localText !== question.question_text) {
        onSave({ question_text: localText });
      }
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localText]);

  // Cleanup options timer on unmount
  useEffect(() => {
    return () => {
      if (optionsTimerRef.current) clearTimeout(optionsTimerRef.current);
    };
  }, []);

  function handleTypeChange(newType: QuestionType) {
    setLocalType(newType);
    onSave({ question_type: newType });
  }

  function handleRequiredChange(val: boolean) {
    setLocalRequired(val);
    onSave({ is_required: val });
  }

  function saveOptions(opts: string[]) {
    if (optionsTimerRef.current) clearTimeout(optionsTimerRef.current);
    optionsTimerRef.current = setTimeout(() => {
      onSave({ metadata: { choices: opts } });
    }, 600);
  }

  function addOption() {
    const next = [...localOptions, `Option ${localOptions.length + 1}`];
    setLocalOptions(next);
    saveOptions(next);
  }

  function addOther() {
    if (localOptions.includes("Other")) return;
    const next = [...localOptions, "Other"];
    setLocalOptions(next);
    saveOptions(next);
  }

  function removeOption(i: number) {
    const next = localOptions.filter((_, idx) => idx !== i);
    setLocalOptions(next);
    saveOptions(next);
  }

  function updateOption(i: number, val: string) {
    const next = [...localOptions];
    next[i] = val;
    setLocalOptions(next);
    saveOptions(next);
  }

  const showOptions = localType === "multiple_choice" || localType === "checkbox";
  const typeLabel = QUESTION_TYPES.find((t) => t.value === localType)?.label ?? localType;

  // ── Inactive preview (looks like a rendered form card) ───────────────────
  if (!isActive) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onActivate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            onActivate();
          }
        }}
        className="cursor-pointer rounded-xl border border-border/60 bg-white px-6 py-5 shadow-sm transition-all hover:shadow-md dark:bg-card"
      >
        {/* Question title */}
        <p className="mb-3 text-sm font-medium text-text-primary">
          {localText || <span className="italic text-text-muted">Untitled Question</span>}
          {localRequired && <span className="ml-1 text-destructive">*</span>}
        </p>

        {/* Answer preview — mirrors what respondents see */}
        {localType === "short_text" && (
          <p className="w-1/2 border-b border-dotted border-text-muted/50 pb-0.5 text-sm text-text-muted">
            Short answer text
          </p>
        )}

        {localType === "long_text" && (
          <p className="w-full border-b border-dotted border-text-muted/50 pb-0.5 text-sm text-text-muted">
            Long answer text
          </p>
        )}

        {(localType === "multiple_choice" || localType === "checkbox") && (
          <div className="space-y-2.5">
            {localOptions.map((opt, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {localType === "multiple_choice" ? (
                  <div className="h-4 w-4 shrink-0 rounded-full border-2 border-text-secondary/50" />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded border-2 border-text-secondary/50" />
                )}
                <span className="text-sm text-text-secondary">{opt}</span>
              </div>
            ))}
          </div>
        )}

        {localType === "rating" && (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-text-muted/40 text-sm text-text-muted"
              >
                {n}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Active editing card ───────────────────────────────────────────────────
  return (
    <div className="rounded-xl border-y border-r border-l-4 border-l-indigo-500 border-border/60 bg-white shadow-md dark:bg-card">
      {/* Drag handle */}
      <div className="flex cursor-grab items-center justify-center py-1.5 text-text-muted/40">
        <GripVertical className="h-4 w-4 rotate-90" />
      </div>

      <div className="px-5 pb-0">
        {/* Question text + type selector */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex flex-1 items-end gap-2 border-b border-input pb-1 transition-colors focus-within:border-indigo-500">
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
              placeholder="Question"
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              autoFocus
              aria-label="Question text"
            />
          </div>

          <div className="shrink-0">
            <Select
              value={localType}
              onValueChange={(v) => handleTypeChange(v as QuestionType)}
            >
              <SelectTrigger className="w-44 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUESTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Type-specific body */}
        <div className="mt-4">
          {/* Multiple choice / checkbox options */}
          {showOptions && (
            <div className="space-y-2">
              {localOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {localType === "multiple_choice" ? (
                    <div className="h-4 w-4 shrink-0 rounded-full border-2 border-text-secondary" />
                  ) : (
                    <div className="h-4 w-4 shrink-0 rounded border-2 border-text-secondary" />
                  )}
                  <input
                    className="flex-1 border-b border-input bg-transparent py-0.5 text-sm outline-none focus:border-indigo-500"
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    aria-label={`Option ${i + 1}`}
                  />
                  {localOptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="text-text-muted hover:text-destructive"
                      aria-label="Remove option"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add option row */}
              <div className="flex items-center gap-2.5">
                {localType === "multiple_choice" ? (
                  <div className="h-4 w-4 shrink-0 rounded-full border-2 border-border" />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded border-2 border-border" />
                )}
                <button
                  type="button"
                  onClick={addOption}
                  className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Add option
                </button>
                <span className="text-sm text-text-muted">or</span>
                <button
                  type="button"
                  onClick={addOther}
                  disabled={localOptions.includes("Other")}
                  className="text-sm text-indigo-600 hover:underline disabled:opacity-40 dark:text-indigo-400"
                >
                  add &ldquo;Other&rdquo;
                </button>
              </div>
            </div>
          )}

          {/* Short / long text preview */}
          {(localType === "short_text" || localType === "long_text") && (
            <div
              className={cn(
                "border-b border-dashed border-input py-2 text-sm text-text-muted",
                localType === "long_text" && "min-h-[60px]"
              )}
            >
              {localType === "short_text" ? "Short answer text" : "Long answer text"}
            </div>
          )}

          {/* Rating preview */}
          {localType === "rating" && (
            <div className="flex gap-2 py-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="flex h-8 w-8 items-center justify-center rounded-full border text-sm text-text-muted"
                >
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer toolbar */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t px-4 py-2.5">
        {/* Ordering controls */}
        <div className="flex items-center gap-0.5 mr-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="rounded p-1 text-text-muted hover:bg-muted hover:text-text-secondary disabled:opacity-30"
            aria-label="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="rounded p-1 text-text-muted hover:bg-muted hover:text-text-secondary disabled:opacity-30"
            aria-label="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-border" />

        {/* Duplicate (future) */}
        <button
          type="button"
          className="rounded p-1.5 text-text-muted opacity-40 cursor-not-allowed"
          aria-label="Duplicate question (coming soon)"
          title="Duplicate (coming soon)"
        >
          <Copy className="h-4 w-4" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          className="rounded p-1.5 text-text-muted hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete question"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-border" />

        {/* Required toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Required</span>
          <RequiredToggle checked={localRequired} onChange={handleRequiredChange} />
        </div>
      </div>
    </div>
  );
}
