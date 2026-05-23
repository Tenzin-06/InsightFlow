import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function AudienceEmptyState({ icon: Icon, title, description, actionLabel, onAction }: Props) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-text-secondary">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5 bg-primary-500 hover:bg-primary-600">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
