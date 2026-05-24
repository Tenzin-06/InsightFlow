import { useState, useEffect, useRef } from "react";
import {
  GripVertical,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  X,
  AlignLeft,
  AlignJustify,
  CheckSquare,
  CircleDot,
  Star,
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

// ── Question type options ─────────────────────────────────────────────────────

const QUESTION_TYPES: { value: QuestionType; label: string; icon: React.ReactNode }[] = [
  { value: "short_text",      label: "Short answer",    icon: <AlignLeft    className="h-3.5 w-3.5" /> },
  { value: "long_text",       label: "Paragraph",       icon: <AlignJustify className="h-3.5 w-3.5" /> },
  { value: "multiple_choice", label: "Multiple choice", icon: <CircleDot    className="h-3.5 w-3.5" /> },
  { value: "checkbox",        label: "Checkboxes",      icon: <CheckSquare  className="h-3.5 w-3.5" /> },
  { value: "rating",          label: "Linear scale",    icon: <Star         className="h-3.5 w-3.5" /> },
];

// ── Required toggle ───────────────────────────────────────────────────────────

function RequiredToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-1",
        checked ? "bg-[#3B82F6]" : "bg-[#CBD5E1]"
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  question: Question;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  onActivate: () => void;
  onSave: (payload: UpdateQuestionPayload) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export function InlineQuestionCard({
  question,
  isFirst,
  isLast,
  isActive,
  onActivate,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [localText,     setLocalText]     = useState(question.question_text);
  const [localType,     setLocalType]     = useState<QuestionType>(question.question_type);
  const [localRequired, setLocalRequired] = useState(question.is_required);
  const [localOptions,  setLocalOptions]  = useState<string[]>(
    () => (question.metadata?.choices as string[] | undefined) ?? ["Option 1"]
  );

  const optionsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync on question id change
  useEffect(() => {
    setLocalText(question.question_text);
    setLocalType(question.question_type);
    setLocalRequired(question.is_required);
    setLocalOptions((question.metadata?.choices as string[] | undefined) ?? ["Option 1"]);
  }, [question.id]);

  // Debounced text save
  useEffect(() => {
    const t = setTimeout(() => {
      if (localText !== question.question_text) onSave({ question_text: localText });
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localText]);

  useEffect(() => {
    return () => { if (optionsTimerRef.current) clearTimeout(optionsTimerRef.current); };
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
    optionsTimerRef.current = setTimeout(() => onSave({ metadata: { choices: opts } }), 600);
  }

  function addOption() {
    const next = [...localOptions, `Option ${localOptions.length + 1}`];
    setLocalOptions(next); saveOptions(next);
  }

  function addOther() {
    if (localOptions.includes("Other")) return;
    const next = [...localOptions, "Other"];
    setLocalOptions(next); saveOptions(next);
  }

  function removeOption(i: number) {
    const next = localOptions.filter((_, idx) => idx !== i);
    setLocalOptions(next); saveOptions(next);
  }

  function updateOption(i: number, val: string) {
    const next = [...localOptions]; next[i] = val;
    setLocalOptions(next); saveOptions(next);
  }

  const showOptions = localType === "multiple_choice" || localType === "checkbox";

  // ── Inactive preview card ─────────────────────────────────────────────────
  if (!isActive) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onActivate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivate(); }
        }}
        className="cursor-pointer rounded-xl border border-[#E2E8F0] bg-white px-6 py-5 shadow-sm transition-all hover:border-[#9FC2FF] hover:shadow-md"
      >
        <p className="mb-3 text-sm font-medium leading-relaxed text-[#0F172A]">
          {localText || <span className="italic text-[#94A3B8]">Untitled Question</span>}
          {localRequired && <span className="ml-1 text-[#EF4444]">*</span>}
        </p>

        {localType === "short_text" && (
          <div className="w-56 border-b border-dashed border-[#CBD5E1] pb-1">
            <span className="text-sm text-[#94A3B8]">Short answer text</span>
          </div>
        )}

        {localType === "long_text" && (
          <div className="w-full border-b border-dashed border-[#CBD5E1] pb-1">
            <span className="text-sm text-[#94A3B8]">Long answer text</span>
          </div>
        )}

        {(localType === "multiple_choice" || localType === "checkbox") && (
          <div className="space-y-2.5">
            {localOptions.slice(0, 3).map((opt, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {localType === "multiple_choice"
                  ? <div className="h-4 w-4 shrink-0 rounded-full border-2 border-[#CBD5E1]" />
                  : <div className="h-4 w-4 shrink-0 rounded border-2 border-[#CBD5E1]" />
                }
                <span className="text-sm text-[#475569]">{opt}</span>
              </div>
            ))}
            {localOptions.length > 3 && (
              <p className="pl-6 text-xs text-[#94A3B8]">+{localOptions.length - 3} more</p>
            )}
          </div>
        )}

        {localType === "rating" && (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] text-sm text-[#94A3B8]">
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
    <div className="overflow-hidden rounded-xl border border-[#9FC2FF] bg-white shadow-md ring-2 ring-[#3B82F6]/10">

      {/* Active header bar */}
      <div className="flex items-center justify-between border-b border-[#EEF4FF] bg-[#EEF4FF] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#3B82F6]" />
          <span className="text-xs font-semibold text-[#3B82F6]">Editing</span>
        </div>
        <div className="cursor-grab text-[#94A3B8] hover:text-[#475569]" title="Drag to reorder">
          <GripVertical className="h-4 w-4 rotate-90" />
        </div>
      </div>

      <div className="px-5 pt-4 pb-0">
        {/* Question text + type selector row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">

          {/* Question text input */}
          <div className="flex flex-1 items-end border-b-2 border-[#9FC2FF] pb-1 transition-colors focus-within:border-[#3B82F6]">
            <input
              className="flex-1 bg-transparent text-sm font-medium text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
              placeholder="Question text"
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              autoFocus
              aria-label="Question text"
            />
          </div>

          {/* Type selector */}
          <div className="shrink-0">
            <Select value={localType} onValueChange={(v) => handleTypeChange(v as QuestionType)}>
              <SelectTrigger className="w-44 border-[#E2E8F0] text-sm text-[#0F172A]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUESTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <span className="flex items-center gap-2">
                      <span className="text-[#94A3B8]">{t.icon}</span>
                      {t.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Type-specific body */}
        <div className="mt-5">

          {/* Multiple choice / checkbox */}
          {showOptions && (
            <div className="space-y-2.5">
              {localOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {localType === "multiple_choice"
                    ? <div className="h-4 w-4 shrink-0 rounded-full border-2 border-[#6EA4FF]" />
                    : <div className="h-4 w-4 shrink-0 rounded border-2 border-[#6EA4FF]" />
                  }
                  <input
                    className="flex-1 border-b border-[#E2E8F0] bg-transparent py-0.5 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#3B82F6]"
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    aria-label={`Option ${i + 1}`}
                  />
                  {localOptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="rounded p-0.5 text-[#94A3B8] transition-colors hover:bg-red-50 hover:text-[#EF4444]"
                      aria-label="Remove option"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add option / Other */}
              <div className="flex items-center gap-2.5 pt-0.5">
                {localType === "multiple_choice"
                  ? <div className="h-4 w-4 shrink-0 rounded-full border-2 border-[#E2E8F0]" />
                  : <div className="h-4 w-4 shrink-0 rounded border-2 border-[#E2E8F0]" />
                }
                <button type="button" onClick={addOption}
                  className="text-sm font-medium text-[#3B82F6] underline-offset-2 hover:text-[#2563EB] hover:underline"
                >
                  Add option
                </button>
                <span className="text-sm text-[#94A3B8]">or</span>
                <button type="button" onClick={addOther}
                  disabled={localOptions.includes("Other")}
                  className="text-sm font-medium text-[#3B82F6] underline-offset-2 hover:text-[#2563EB] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                >
                  add &ldquo;Other&rdquo;
                </button>
              </div>
            </div>
          )}

          {/* Short / long text preview */}
          {(localType === "short_text" || localType === "long_text") && (
            <div className={cn(
              "rounded-lg border border-dashed border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#94A3B8]",
              localType === "long_text" ? "min-h-[72px]" : "max-w-[55%]"
            )}>
              {localType === "short_text" ? "Short answer text" : "Long answer text"}
            </div>
          )}

          {/* Rating scale */}
          {localType === "rating" && (
            <div className="flex items-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C7DDFF] bg-[#EEF4FF] text-sm font-semibold text-[#3B82F6]">
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer toolbar */}
      <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-[#EEF2F7] bg-[#F8FAFC] px-4 py-2.5">

        {/* Move up/down */}
        <div className="mr-0.5 flex items-center gap-0.5">
          <button type="button" onClick={onMoveUp} disabled={isFirst}
            className="rounded-md p-1.5 text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#475569] disabled:opacity-25"
            aria-label="Move question up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={isLast}
            className="rounded-md p-1.5 text-[#94A3B8] transition-colors hover:bg-[#F1F5F9] hover:text-[#475569] disabled:opacity-25"
            aria-label="Move question down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-[#E2E8F0]" />

        {/* Duplicate (coming soon) */}
        <button type="button"
          className="cursor-not-allowed rounded-md p-1.5 text-[#94A3B8]/30"
          aria-label="Duplicate (coming soon)"
          title="Duplicate (coming soon)"
        >
          <Copy className="h-4 w-4" />
        </button>

        {/* Delete */}
        <button type="button" onClick={onDelete}
          className="rounded-md p-1.5 text-[#94A3B8] transition-colors hover:bg-red-50 hover:text-[#EF4444]"
          aria-label="Delete question"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <div className="h-4 w-px bg-[#E2E8F0]" />

        {/* Required toggle */}
        <div className="flex items-center gap-2.5 pl-0.5">
          <span className="text-sm font-medium text-[#475569]">Required</span>
          <RequiredToggle checked={localRequired} onChange={handleRequiredChange} />
        </div>
      </div>
    </div>
  );
}
