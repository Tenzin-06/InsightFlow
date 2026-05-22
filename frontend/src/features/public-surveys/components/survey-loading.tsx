import { Skeleton } from "@/components/ui/skeleton";
import { SurveyContainer } from "./survey-container";

/**
 * Skeleton loading state for the survey page.
 * Mirrors the final layout to prevent layout shifts.
 */
export function SurveyLoading() {
  return (
    <SurveyContainer>
      {/* Header skeleton */}
      <div className="mb-6 rounded-xl bg-bg-secondary p-6 shadow-sm">
        <Skeleton className="mb-4 h-1 w-12 rounded-full" />
        <Skeleton className="mb-2 h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-2/3" />
        <Skeleton className="mt-4 h-3 w-32" />
      </div>

      {/* Progress skeleton */}
      <div className="mb-6 rounded-xl bg-bg-secondary p-4 shadow-sm">
        <div className="mb-2 flex justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Question skeletons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="mb-4 rounded-xl bg-bg-secondary p-6 shadow-sm"
        >
          <div className="mb-1 flex items-start gap-2">
            <Skeleton className="mt-0.5 h-4 w-4 rounded-full flex-shrink-0" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <Skeleton className="mt-4 h-10 w-full rounded-md" />
        </div>
      ))}

      {/* Submit skeleton */}
      <div className="mt-8">
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    </SurveyContainer>
  );
}
