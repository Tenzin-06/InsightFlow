import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function EmailLayout({
  subject,
  previewText,
  senderName,
  html,
  compact = false,
}: {
  subject: string;
  previewText: string;
  senderName: string;
  html: string;
  compact?: boolean;
}) {
  return (
    <Card className={cn("mx-auto w-full bg-bg-secondary", compact ? "max-w-[360px]" : "max-w-2xl")}>
      <CardContent className="space-y-4 p-0">
        <div className="border-b border-border bg-bg-tertiary px-5 py-4">
          <div className="text-xs text-text-muted">From: {senderName || "InsightFlow Research Team"}</div>
          <div className="mt-1 text-sm font-semibold text-text-primary">
            {subject || "Your survey invitation subject"}
          </div>
          {previewText ? <div className="mt-1 text-xs text-text-secondary">{previewText}</div> : null}
        </div>
        <article
          className="prose prose-sm max-w-none px-5 pb-5 text-text-primary dark:prose-invert prose-a:text-primary-600"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </CardContent>
    </Card>
  );
}
