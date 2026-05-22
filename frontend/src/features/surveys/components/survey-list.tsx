import { Skeleton } from "@/components/ui/skeleton";
import { SurveyCard } from "./survey-card";
import { EmptyState } from "./empty-state";
import type { Survey } from "@/features/surveys/types";

type Props = {
  surveys: Survey[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onCreateClick: () => void;
};

function SurveyCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <div className="mt-4 flex gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function SurveyList({ surveys, isLoading, onDelete, onPublish, onCreateClick }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SurveyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (surveys.length === 0) {
    return (
      <EmptyState
        title="No surveys yet"
        description="Create your first survey to start collecting responses and generating insights."
        actionLabel="Create Survey"
        onAction={onCreateClick}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {surveys.map((survey) => (
        <SurveyCard
          key={survey.id}
          survey={survey}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      ))}
    </div>
  );
}
