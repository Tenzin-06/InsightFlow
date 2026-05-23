import { motion } from "framer-motion";

import { MESSAGE_ENTER_DURATION, MESSAGE_EASE } from "../constants";

interface TransitionWrapperProps {
  /** Unique key for this animation (message id) */
  id: string;
  /** Directional bias: questions slide from left, answers from right */
  direction?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

/**
 * TransitionWrapper
 *
 * Wraps a single conversation message in a framer-motion enter animation.
 * Does NOT use AnimatePresence because messages stay visible once rendered;
 * exit animations are not needed.
 *
 * direction="left"  → slides in from the left  (question bubbles)
 * direction="right" → slides in from the right (answer bubbles)
 */
export function TransitionWrapper({
  id,
  direction = "left",
  children,
  className,
}: TransitionWrapperProps) {
  const xOffset = direction === "left" ? -14 : 14;

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, x: xOffset, y: 4 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: MESSAGE_ENTER_DURATION, ease: MESSAGE_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
