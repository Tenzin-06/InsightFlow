import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ label = "Loading campaign..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-44 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
