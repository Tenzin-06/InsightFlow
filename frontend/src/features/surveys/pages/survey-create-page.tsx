import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/page-container";
import { SurveyHeader } from "@/features/surveys/components/survey-header";
import { SurveyForm } from "@/features/surveys/components/survey-form";
import { useCreateSurvey } from "@/features/surveys/hooks/use-surveys";
import type { CreateSurveyPayload } from "@/features/surveys/types";

export default function SurveyCreatePage() {
  const navigate = useNavigate();
  const createSurvey = useCreateSurvey();

  function handleSubmit(data: CreateSurveyPayload) {
    createSurvey.mutate(data, {
      onSuccess: (survey) => {
        navigate(`/surveys/${survey.id}/edit`);
      },
    });
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <SurveyHeader title="Create Survey" backTo="/surveys" />

        <div className="mx-auto max-w-xl rounded-xl border border-slate-200/50 bg-card p-6 shadow ring-1 ring-slate-200/30 dark:border-slate-700/30 dark:ring-slate-700/20">
          <SurveyForm
            onSubmit={handleSubmit}
            isLoading={createSurvey.isPending}
            submitLabel="Create & Edit Survey"
          />
        </div>
      </div>
    </PageContainer>
  );
}
