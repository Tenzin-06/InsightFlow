import { useState, useRef, useEffect } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { PublicQuestion, AnswerValue } from "../types";

interface ConversationalLongTextProps {
  question: PublicQuestion;
  validationError: string | null;
  isDisabled: boolean;
  onSubmit: (value: AnswerValue) => void;
}

/**
 * ConversationalLongText
 *
 * Multi-line textarea input.
 * - Ctrl/Cmd + Enter submits (Enter adds a newline for comfortable typing)
 * - Auto-focus on question activation
 * - "Send" button below the textarea
 */
export function ConversationalLongText({
  question,
  validationError,
  isDisabled,
  onSubmit,
}: ConversationalLongTextProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [question.id, isDisabled]);

  function handleSubmit() {
    onSubmit(value.trim() || null);
  }

  return (
    <div className="space-y-2">
      <Textarea
        ref={textareaRef}
        id={`conv-field-${question.id}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !isDisabled) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Type your answer… (Ctrl+Enter to send)"
        disabled={isDisabled}
        aria-invalid={!!validationError}
        aria-label={question.question_text}
        rows={3}
        className="resize-none text-base"
      />
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isDisabled}
        className="w-full"
        aria-label="Send answer"
      >
        Send
      </Button>
    </div>
  );
}
