import { MESSAGE_ENTER_DURATION, MESSAGE_EASE } from "../constants";

/**
 * useConversationAnimation
 *
 * Returns reusable framer-motion animation variants and transition configs
 * for the conversational survey bubbles. Centralising these here keeps
 * all animation timings adjustable from one place.
 */
export function useConversationAnimation() {
  /** Slide-in from the left — used for question bubbles */
  const questionVariants = {
    hidden: { opacity: 0, x: -16, y: 4 },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  /** Slide-in from the right — used for answer bubbles */
  const answerVariants = {
    hidden: { opacity: 0, x: 16, y: 4 },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  /** Fade in only — used for typing indicator and validation messages */
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  /** Completion screen scale-up */
  const completionVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const transition = {
    duration: MESSAGE_ENTER_DURATION,
    ease: MESSAGE_EASE,
  };

  return {
    questionVariants,
    answerVariants,
    fadeVariants,
    completionVariants,
    transition,
  };
}
