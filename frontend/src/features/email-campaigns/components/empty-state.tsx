import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-bg-secondary p-6 text-center">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      {description ? <p className="mt-1 text-sm text-text-secondary">{description}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
