import { useEffect, useRef } from "react";

import { QuestionBubble } from "./question-bubble";
import { AnswerBubble } from "./answer-bubble";
import { TypingIndicator } from "./typing-indicator";
import type { ConversationMessage } from "../types";

interface MessageStreamProps {
  messages: ConversationMessage[];
  isTyping: boolean;
}

/**
 * MessageStream
 *
 * Scrollable area that renders the full conversation history.
 * Automatically scrolls to the bottom whenever new messages are added
 * or the typing indicator appears/disappears.
 *
 * Layout:
 *   - flex-1 to fill available space between header+progress and input
 *   - overflow-y-auto for independent scrolling
 *   - padding-bottom so the last message isn't hidden behind the input area
 */
export function MessageStream({ messages, isTyping }: MessageStreamProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever the conversation advances
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isTyping]);

  return (
    <div
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4 pt-4"
      role="log"
      aria-label="Survey conversation"
      aria-live="polite"
    >
      {messages.map((msg) =>
        msg.type === "question" ? (
          <QuestionBubble key={msg.id} message={msg} />
        ) : (
          <AnswerBubble key={msg.id} message={msg} />
        )
      )}

      <TypingIndicator visible={isTyping} />

      {/* Invisible anchor to scroll to */}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
