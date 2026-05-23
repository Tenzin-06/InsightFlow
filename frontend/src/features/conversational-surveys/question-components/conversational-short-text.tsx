import { useState, useRef, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { PublicQuestion, AnswerValue } from "../types";

interface ConversationalShortTextProps {
  question: PublicQuestion;
  validationError: string | null;
  isDisabled: boolean;
  onSubmit: (value: AnswerValue) => void;
}

/**
 * ConversationalShortText
 *
 * Single-line text input with:
 * - Enter key to submit
 * - Auto-focus when the question becomes active
 * - Send button (touch-friendly)
 */
export function ConversationalShortText({
  question,
  validationError,
  isDisabled,
  onSubmit,
}: ConversationalShortTextProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when this question becomes active
  useEffect(() => {
    if (!isDisabled) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [question.id, isDisabled]);

  function handleSubmit() {
    onSubmit(value.trim() || null);
  }

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        id={`conv-field-${question.id}`}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isDisabled) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Type your answer…"
        disabled={isDisabled}
        aria-invalid={!!validationError}
        aria-label={question.question_text}
        className="h-11 flex-1 text-base"
        autoComplete="off"
      />
      <Button
        type="button"
        size="icon"
        onClick={handleSubmit}
        disabled={isDisabled}
        aria-label="Send answer"
        className="h-11 w-11 shrink-0"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
