import { motion, AnimatePresence } from "framer-motion";

import { ConversationalShortText } from "../question-components/conversational-short-text";
import { ConversationalLongText } from "../question-components/conversational-long-text";
import { ConversationalMultipleChoice } from "../question-components/conversational-multiple-choice";
import { ConversationalCheckbox } from "../question-components/conversational-checkbox";
import { ConversationalRating } from "../question-components/conversational-rating";
import type { PublicQuestion, AnswerValue } from "../types";

interface ConversationalInputProps {
  /** The question currently accepting input */
  question: PublicQuestion;
  /** Validation error message for the current question, if any */
  validationError: string | null;
  /** Disabled while typing indicator is showing or submission is in flight */
  isDisabled: boolean;
  /** Called when the respondent commits their answer */
  onSubmit: (value: AnswerValue) => void;
}

/**
 * ConversationalInput
 *
 * Dispatcher that maps a question's type to the appropriate conversational
 * input component. Lives in a sticky footer area at the bottom of the screen.
 *
 * Renders with a slide-up animation when a new question becomes active.
 */
export function ConversationalInput({
  question,
  validationError,
  isDisabled,
  onSubmit,
}: ConversationalInputProps) {
  const sharedProps = {
    question,
    onSubmit,
    isDisabled,
    validationError,
  };

  function renderInput() {
    switch (question.question_type) {
      case "short_text":
        return <ConversationalShortText {...sharedProps} />;
      case "long_text":
        return <ConversationalLongText {...sharedProps} />;
      case "multiple_choice":
        return <ConversationalMultipleChoice {...sharedProps} />;
      case "checkbox":
        return <ConversationalCheckbox {...sharedProps} />;
      case "rating":
        return <ConversationalRating {...sharedProps} />;
      default:
        return (
          <p className="text-sm text-text-muted">
            Unsupported question type: {question.question_type}
          </p>
        );
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="shrink-0 border-t border-border-soft bg-bg-secondary px-4 py-4"
      >
        {/* Validation error — inline, non-blocking */}
        <AnimatePresence>
          {validationError && (
            <motion.p
              key="validation-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              role="alert"
              className="mb-2 text-xs font-medium text-danger"
            >
              {validationError}
            </motion.p>
          )}
        </AnimatePresence>

        {renderInput()}
      </motion.div>
    </AnimatePresence>
  );
}
