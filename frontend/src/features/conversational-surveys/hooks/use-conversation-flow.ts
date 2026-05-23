import { useState, useEffect, useCallback } from "react";

import { TYPING_DELAY_MS } from "../constants";
import { isAnswered, buildQuestionMessage, buildAnswerMessage } from "../utils";
import type {
  PublicSurvey,
  PublicQuestion,
  AnswerValue,
  ConversationMessage,
  ConversationPhase,
  ConversationFlowResult,
} from "../types";

/**
 * useConversationFlow
 *
 * The core orchestrator for the conversational one-question-at-a-time experience.
 *
 * State machine:
 *   active          → user answering questions sequentially
 *   submitting      → all answers in, API call in flight
 *   complete        → submission succeeded
 *   submission_error → submission failed, retry available
 *
 * Flow per answer:
 *   submitAnswer(value)
 *     → validate required
 *     → append answer bubble to messages
 *     → set isTyping=true
 *     → after TYPING_DELAY_MS:
 *         if last question → setPhase('submitting')
 *         else             → append next question bubble, advance index
 */
export function useConversationFlow(
  survey: PublicSurvey | undefined
): ConversationFlowResult {
  const questions: PublicQuestion[] = survey?.questions ?? [];

  const [phase, setPhase] = useState<ConversationPhase>("active");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Seed the first question bubble once the survey is available
  useEffect(() => {
    if (!survey || questions.length === 0) return;
    setMessages([buildQuestionMessage(questions[0])]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey?.id]);

  const currentQuestion = questions[currentIndex] ?? null;
  const totalCount = questions.length;

  const clearValidationError = useCallback(() => setValidationError(null), []);

  const submitAnswer = useCallback(
    (value: AnswerValue) => {
      if (!currentQuestion) return;

      // Validate required field
      if (currentQuestion.is_required && !isAnswered(value)) {
        setValidationError("Please answer before continuing.");
        return;
      }
      setValidationError(null);

      // Persist the answer
      const nextAnswers = { ...answers, [String(currentQuestion.id)]: value };
      setAnswers(nextAnswers);

      // Append the user's answer bubble
      setMessages((prev) => [
        ...prev,
        buildAnswerMessage(currentQuestion, value),
      ]);

      const isLast = currentIndex >= questions.length - 1;

      // Show typing indicator, then either advance or submit
      setIsTyping(true);

      if (isLast) {
        setTimeout(() => {
          setIsTyping(false);
          setPhase("submitting");
        }, TYPING_DELAY_MS);
      } else {
        setTimeout(() => {
          const nextQ = questions[currentIndex + 1];
          setIsTyping(false);
          setMessages((prev) => [...prev, buildQuestionMessage(nextQ)]);
          setCurrentIndex((i) => i + 1);
        }, TYPING_DELAY_MS);
      }
    },
    [currentQuestion, currentIndex, questions, answers]
  );

  return {
    phase,
    setPhase,
    currentQuestion,
    currentIndex,
    totalCount,
    answers,
    messages,
    isTyping,
    validationError,
    clearValidationError,
    submitAnswer,
  };
}
