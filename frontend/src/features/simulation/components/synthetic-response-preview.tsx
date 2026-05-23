import { Badge } from "@/components/ui/badge";
import type { SyntheticResponsePreview } from "@/features/simulation/types";

type SyntheticResponsePreviewProps = {
  responses: SyntheticResponsePreview[];
};

export function SyntheticResponsePreviewPanel({ responses }: SyntheticResponsePreviewProps) {
  return (
    <section className="space-y-3 rounded-lg border border-border-default bg-bg-secondary p-5">
      <h2 className="text-sm font-semibold text-text-primary">Synthetic Response Preview</h2>
      {responses.length === 0 ? (
        <p className="text-sm text-text-muted">No synthetic responses available yet.</p>
      ) : (
        <ul className="space-y-2">
          {responses.map((response) => (
            <li key={response.id} className="rounded-md border border-border-soft bg-bg-muted p-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold text-text-primary">{response.persona_name}</p>
                <Badge className="bg-orange-500 text-white">Synthetic Response</Badge>
                <Badge variant="outline">AI Generated</Badge>
                <span className="ml-auto text-xs text-text-muted">
                  confidence {Math.round(response.confidence * 100)}%
                </span>
              </div>
              <p className="text-xs text-text-secondary">{response.question}</p>
              <p className="mt-1 text-sm text-text-primary">{response.response}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

