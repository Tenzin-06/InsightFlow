import { TransitionWrapper } from "./transition-wrapper";
import type { AnswerMessage } from "../types";

interface AnswerBubbleProps {
  message: AnswerMessage;
}

/**
 * AnswerBubble
 *
 * Right-aligned chat bubble representing the respondent's answer.
 * Uses the primary brand colour to differentiate it from question bubbles.
 */
export function AnswerBubble({ message }: AnswerBubbleProps) {
  return (
    <TransitionWrapper id={message.id} direction="right" className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary-500 px-4 py-3 shadow-sm">
        <p className="text-sm leading-relaxed text-white">
          {message.displayValue}
        </p>
      </div>
    </TransitionWrapper>
  );
}
