import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Globe, Trash2 } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SurveyHeader } from "@/features/surveys/components/survey-header";
import { useSurvey } from "@/features/surveys/hooks/use-survey";
import { useUpdateSurvey, useDeleteSurvey } from "@/features/surveys/hooks/use-surveys";
import { useQuestions } from "@/features/surveys/hooks/use-questions";
import { ShareModal } from "@/features/survey-sharing/components/share-modal";

const questionTypeLabels: Record<string, string> = {
  short_text: "Short Text",
  long_text: "Long Text",
  multiple_choice: "Multiple Choice",
  checkbox: "Checkbox",
  rating: "Rating",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function SurveyDetailPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const { data: survey, isLoading } = useSurvey(surveyId!);
  const { data: questions = [] } = useQuestions(surveyId!);
  const updateSurvey = useUpdateSurvey();
  const deleteSurvey = useDeleteSurvey();

  function handlePublish() {
    updateSurvey.mutate({ id: surveyId!, payload: { status: "published" } });
  }

  function handleDelete() {
    if (deleteSurvey.isPending) return;
    if (window.confirm("Delete this survey? This action cannot be undone.")) {
      deleteSurvey.mutate(surveyId!, {
        onSuccess: () => navigate("/surveys"),
      });
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  if (!survey) {
    return (
      <PageContainer>
        <p className="text-sm text-text-secondary">Survey not found.</p>
      </PageContainer>
    );
  }

  const typeCounts = questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.question_type] = (acc[q.question_type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <PageContainer>
      <div className="space-y-6">
        <SurveyHeader
          title={survey.title}
          status={survey.status}
          backTo="/surveys"
          actions={
            <>
              {survey.status === "published" && survey.slug && (
                <ShareModal
                  surveyId={survey.id}
                  surveyTitle={survey.title}
                  surveyDescription={survey.description}
                  slug={survey.slug}
                />
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/surveys/${survey.id}/edit`)}
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Button>
              {survey.status === "draft" && (
                <Button
                  size="sm"
                  onClick={handlePublish}
                  disabled={updateSurvey.isPending}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  <Globe className="mr-1.5 h-3.5 w-3.5" />
                  Publish
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleteSurvey.isPending}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete
              </Button>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Survey Overview */}
          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
              Overview
            </h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">Status</dt>
                <dd className="font-medium capitalize text-text-primary">{survey.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Visibility</dt>
                <dd className="font-medium text-text-primary">
                  {survey.is_public ? "Public" : "Private"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Created</dt>
                <dd className="font-medium text-text-primary">{formatDate(survey.created_at)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Last Updated</dt>
                <dd className="font-medium text-text-primary">{formatDate(survey.updated_at)}</dd>
              </div>
            </dl>
            {survey.description && (
              <div className="mt-4 border-t pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Description
                </p>
                <p className="mt-1 text-sm text-text-secondary">{survey.description}</p>
              </div>
            )}
          </section>

          {/* Question Summary */}
          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
              Questions
            </h2>
            <div className="mb-3 text-3xl font-bold text-text-primary">
              {questions.length}
            </div>
            {questions.length > 0 ? (
              <dl className="space-y-2 text-sm">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <dt className="text-text-secondary">
                      {questionTypeLabels[type] ?? type}
                    </dt>
                    <dd className="font-medium text-text-primary">{count}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-text-muted">No questions added yet.</p>
            )}
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
