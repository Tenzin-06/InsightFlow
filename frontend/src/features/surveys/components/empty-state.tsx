import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20">
        <FileText className="h-8 w-8 text-primary-500" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-text-secondary">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-primary-500 hover:bg-primary-600">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
