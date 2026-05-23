import { TransitionWrapper } from "./transition-wrapper";
import type { QuestionMessage } from "../types";

interface QuestionBubbleProps {
  message: QuestionMessage;
}

/**
 * QuestionBubble
 *
 * Left-aligned chat bubble representing a survey question.
 * Styled to resemble an assistant message in a modern chat interface.
 */
export function QuestionBubble({ message }: QuestionBubbleProps) {
  return (
    <TransitionWrapper id={message.id} direction="left" className="flex items-end gap-2">
      {/* Avatar dot — represents the "survey assistant" */}
      <div
        className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600"
        aria-hidden="true"
      >
        S
      </div>

      {/* Bubble */}
      <div
        className="max-w-[80%] rounded-2xl rounded-bl-sm bg-bg-secondary px-4 py-3 shadow-sm"
        role="log"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-sm leading-relaxed text-text-primary">
          {message.text}
          {message.isRequired && (
            <span
              className="ml-1 text-danger"
              aria-label="required"
              title="This question is required"
            >
              *
            </span>
          )}
        </p>
      </div>
    </TransitionWrapper>
  );
}
