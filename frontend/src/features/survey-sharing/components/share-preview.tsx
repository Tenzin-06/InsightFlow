import { Globe } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  url: string;
};

export function SharePreview({ title, description, url }: Props) {
  return (
    <div className="rounded-lg border bg-muted/50 p-3">
      <div className="flex items-start gap-2">
        <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text-primary">{title}</p>
          {description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">{description}</p>
          )}
          <p className="mt-1 truncate text-xs text-primary-500">{url}</p>
        </div>
      </div>
    </div>
  );
}
