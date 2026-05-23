/**
 * Conversational Survey Constants
 */

/** Duration of the "typing indicator" between a submitted answer and the next question (ms) */
export const TYPING_DELAY_MS = 800;

/** Framer-motion duration for message bubble enter animations (seconds) */
export const MESSAGE_ENTER_DURATION = 0.28;

/** Framer-motion ease for message bubbles */
export const MESSAGE_EASE = "easeOut" as const;

/** Minimum rating scale value when not set in metadata */
export const DEFAULT_RATING_MIN = 1;

/** Maximum rating scale value when not set in metadata */
export const DEFAULT_RATING_MAX = 5;

/** Max characters shown for a long-text answer in the answer bubble */
export const ANSWER_DISPLAY_MAX_CHARS = 120;
