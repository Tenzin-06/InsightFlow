import { motion, AnimatePresence } from "framer-motion";

interface TypingIndicatorProps {
  visible: boolean;
}

/**
 * TypingIndicator
 *
 * Three bouncing dots that simulate the survey "thinking" between questions.
 * Mimics the typing indicator found in modern messaging applications.
 * Rendered with AnimatePresence so it fades out cleanly when hidden.
 */
export function TypingIndicator({ visible }: TypingIndicatorProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="typing"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="flex items-end gap-2"
          aria-label="Survey is preparing next question"
          role="status"
        >
          {/* Avatar to match question bubbles */}
          <div
            className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600"
            aria-hidden="true"
          >
            S
          </div>

          {/* Bouncing dots bubble */}
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-bg-secondary px-4 py-3 shadow-sm">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-2 w-2 rounded-full bg-text-muted"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 0.55,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.12,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
