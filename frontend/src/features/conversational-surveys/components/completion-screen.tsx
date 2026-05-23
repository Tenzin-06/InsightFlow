import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ConversationContainer } from "./conversation-container";

interface CompletionScreenProps {
  surveyTitle: string;
}

/**
 * CompletionScreen (Conversational)
 *
 * Shown after a successful conversational survey submission.
 * Animates in with a scale + fade to feel like a natural conversation ending.
 */
export function ConversationalCompletionScreen({
  surveyTitle,
}: CompletionScreenProps) {
  return (
    <ConversationContainer>
      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-sm rounded-2xl bg-bg-secondary p-8 text-center shadow-md"
        >
          {/* Success icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" aria-hidden="true" />
          </div>

          <h1 className="text-xl font-bold text-text-primary">
            Thank you! 🎉
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Your response to{" "}
            <span className="font-medium text-text-primary">{surveyTitle}</span>{" "}
            has been submitted.
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Your feedback helps create better insights.
          </p>

          <div className="mt-7">
            <Button asChild size="lg" className="w-full">
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </ConversationContainer>
  );
}
