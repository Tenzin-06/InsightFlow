import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

// Reuse loading/error states from the standard public-survey feature
import { SurveyLoading } from "@/features/public-surveys/components/survey-loading";
import { SurveyError } from "@/features/public-surveys/components/survey-error";
import { usePublicSurvey } from "@/features/public-surveys/hooks/use-public-survey";

import { buildAnswerPayload } from "../utils";
import { useConversationFlow } from "../hooks/use-conversation-flow";
import { useConversationalSubmission } from "../hooks/use-conversational-submission";
import { useConversationProgress } from "../hooks/use-conversation-progress";

import { ConversationContainer } from "../components/conversation-container";
import { ConversationHeader } from "../components/conversation-header";
import { ProgressIndicator } from "../components/progress-indicator";
import { MessageStream } from "../components/message-stream";
import { ConversationalInput } from "../components/conversational-input";
import { ConversationalCompletionScreen } from "../components/completion-screen";
import type { PublicSurvey } from "../types";

// ---------------------------------------------------------------------------
// Route entry point — handles survey loading
// ---------------------------------------------------------------------------

/**
 * ConversationalSurveyPage
 *
 * Route: /s/:surveyId/chat
 *
 * Fetches the survey (same public API as the standard form) and hands
 * it to <ConversationalSurvey> for the chat-style experience.
 */
export default function ConversationalSurveyPage() {
  const { surveyId = "" } = useParams<{ surveyId: string }>();

  const {
    data: survey,
    isLoading,
    isError,
    error,
    refetch,
  } = usePublicSurvey(surveyId);

  if (isLoading) return <SurveyLoading />;

  if (isError || !survey) {
    return (
      <SurveyError
        error={error as { message?: string; status?: number } | null}
        onRetry={() => void refetch()}
      />
    );
  }

  return <ConversationalSurvey survey={survey} surveyId={surveyId} />;
}

// ---------------------------------------------------------------------------
// Inner component — orchestrates the full conversational experience
// ---------------------------------------------------------------------------

interface ConversationalSurveyProps {
  survey: PublicSurvey;
  surveyId: string;
}

function ConversationalSurvey({ survey, surveyId }: ConversationalSurveyProps) {
  const flow = useConversationFlow(survey);
  const { mutate: submit, isPending } = useConversationalSubmission(surveyId);

  // Accurate progress tracking using completedQuestions from the store
  const progress = useConversationProgress({
    totalQuestions: survey.questions.length,
  });

  // Trigger the API submission once all questions are answered
  useEffect(() => {
    if (flow.phase !== "submitting") return;

    const payload = {
      answers: buildAnswerPayload(survey.questions, flow.answers),
    };

    submit(payload, {
      onSuccess: () => {
        flow.setPhase("complete");
      },
      onError: (err) => {
        toast.error(err?.message ?? "Submission failed. Please try again.", {
          duration: 5000,
        });
        flow.setPhase("submission_error");
      },
    });
  // Intentionally depends only on flow.phase to avoid re-triggering
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.phase]);

  // Completion screen
  if (flow.phase === "complete") {
    return <ConversationalCompletionScreen surveyTitle={survey.title} />;
  }

  // Handle empty survey gracefully
  if (survey.questions.length === 0) {
    return (
      <ConversationContainer>
        <ConversationHeader title={survey.title} />
        <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-text-muted">
          This survey has no questions yet.
        </div>
      </ConversationContainer>
    );
  }

  const isInputDisabled =
    flow.isTyping ||
    flow.phase === "submitting" ||
    isPending;

  return (
    <ConversationContainer>
      {/* Top bar */}
      <ConversationHeader title={survey.title} />

      {/* Minimal progress — keeps immersion */}
      <ProgressIndicator
        displayNumber={progress.displayNumber}
        total={progress.totalCount}
        percentage={progress.percentage}
      />

      {/* Scrollable conversation history */}
      <MessageStream messages={flow.messages} isTyping={flow.isTyping} />

      {/* Sticky input area — hidden while submitting */}
      {flow.phase !== "submitting" && flow.currentQuestion && (
        <ConversationalInput
          question={flow.currentQuestion}
          validationError={flow.validationError}
          isDisabled={isInputDisabled}
          onSubmit={(value) => {
            flow.clearValidationError();
            flow.submitAnswer(value);
          }}
        />
      )}

      {/* Submission error retry */}
      {flow.phase === "submission_error" && (
        <div className="shrink-0 border-t border-border-soft bg-bg-secondary px-4 py-4">
          <p className="mb-2 text-sm text-text-secondary">
            Something went wrong sending your responses.
          </p>
          <button
            type="button"
            onClick={() => flow.setPhase("submitting")}
            disabled={isPending}
            className="w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
          >
            {isPending ? "Retrying…" : "Retry submission"}
          </button>
        </div>
      )}
    </ConversationContainer>
  );
}
