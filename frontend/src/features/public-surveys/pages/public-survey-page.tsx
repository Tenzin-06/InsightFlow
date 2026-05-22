import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";

import { usePublicSurvey } from "../hooks/use-public-survey";
import { useSurveySubmission } from "../hooks/use-survey-submission";
import { buildAnswerPayload, isAnswered } from "../utils";

import { SurveyContainer } from "../components/survey-container";
import { SurveyHeader } from "../components/survey-header";
import { SurveyProgress } from "../components/survey-progress";
import { SurveyFooter } from "../components/survey-footer";
import { SurveyLoading } from "../components/survey-loading";
import { SurveyError } from "../components/survey-error";
import { CompletionScreen } from "../components/completion-screen";
import { SubmitButton } from "../components/submit-button";
import { QuestionRenderer } from "../components/question-renderer";
import type { SurveyFormValues, AnswerValue } from "../types";

/**
 * Public Survey Page — orchestrates the full respondent experience.
 *
 * Flow:
 *   Loading state → Survey form → Submission → Completion screen
 *   Error state → Retry / Go Home
 */
export default function PublicSurveyPage() {
  const { surveyId = "" } = useParams<{ surveyId: string }>();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const {
    data: survey,
    isLoading,
    isError,
    error,
    refetch,
  } = usePublicSurvey(surveyId);

  const { mutate: submitSurvey, isPending: isSubmitting } = useSurveySubmission(surveyId);

  // ---------------------------------------------------------------------------
  // Form state — centralized via FormProvider so question components can
  // access it via useFormContext without prop drilling
  // ---------------------------------------------------------------------------

  const methods = useForm<SurveyFormValues>({
    defaultValues: {},
    mode: "onChange",
  });

  const { handleSubmit, setError, watch } = methods;
  const formValues = watch() as Record<string, AnswerValue>;

  // ---------------------------------------------------------------------------
  // Early returns: loading / error / completion
  // ---------------------------------------------------------------------------

  if (isLoading) return <SurveyLoading />;

  if (isError || !survey) {
    return (
      <SurveyError
        error={error as { message?: string; status?: number } | null}
        onRetry={() => void refetch()}
      />
    );
  }

  if (isSubmitted) {
    return <CompletionScreen surveyTitle={survey.title} />;
  }

  // ---------------------------------------------------------------------------
  // Submission handler
  // ---------------------------------------------------------------------------

  function onSubmit(values: SurveyFormValues) {
    if (!survey) return;

    // Validate required questions before sending
    const missingRequired = survey.questions.filter((q) => {
      if (!q.is_required) return false;
      return !isAnswered(values[q.id]);
    });

    if (missingRequired.length > 0) {
      missingRequired.forEach((q) => {
        setError(q.id as never, {
          type: "required",
          message: "This question is required.",
        });
      });

      // Scroll to first invalid question
      const firstMissingId = missingRequired[0].id;
      const el = document.getElementById(`field-${firstMissingId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });

      return;
    }

    const answers = buildAnswerPayload(survey.questions, values);

    submitSurvey(
      { answers },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        onError: (err: { message?: string }) => {
          toast.error(
            err?.message ?? "Submission failed. Please try again.",
            { duration: 5000 }
          );
        },
      }
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <SurveyContainer>
      {/* Survey identity */}
      <SurveyHeader
        title={survey.title}
        description={survey.description}
        questionCount={survey.question_count}
      />

      {/* Completion progress */}
      <SurveyProgress questions={survey.questions} formValues={formValues} />

      {/* Survey form — FormProvider exposes form context to all question components */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label={`Survey: ${survey.title}`}
        >
          {/* Question list */}
          <div className="space-y-4">
            {survey.questions
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((question, index) => (
                <QuestionRenderer
                  key={question.id}
                  question={question}
                  index={index}
                />
              ))}
          </div>

          {/* Empty state */}
          {survey.questions.length === 0 && (
            <div className="rounded-xl bg-bg-secondary p-8 text-center text-sm text-text-muted shadow-sm">
              This survey has no questions yet.
            </div>
          )}

          {/* Submit */}
          {survey.questions.length > 0 && (
            <div className="mt-8">
              <SubmitButton isSubmitting={isSubmitting} />
            </div>
          )}
        </form>
      </FormProvider>

      <SurveyFooter />
    </SurveyContainer>
  );
}
