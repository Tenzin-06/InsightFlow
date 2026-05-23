import { Brain, MessageSquare, Star, Lightbulb } from "lucide-react";
import type { ReportInsight } from "../types";

const ICONS: Record<ReportInsight["type"], React.ReactNode> = {
  summary: <Brain className="h-4 w-4 text-ai-600" aria-hidden="true" />,
  sentiment: <MessageSquare className="h-4 w-4 text-ai-600" aria-hidden="true" />,
  quality: <Star className="h-4 w-4 text-ai-600" aria-hidden="true" />,
  recommendation: <Lightbulb className="h-4 w-4 text-ai-600" aria-hidden="true" />,
};

const TYPE_LABELS: Record<ReportInsight["type"], string> = {
  summary: "AI Summary",
  sentiment: "Sentiment",
  quality: "Quality Score",
  recommendation: "Recommendation",
};

type ReportInsightBlockProps = { title?: string; insights: ReportInsight[] };

export function ReportInsightBlock({ title = "AI Insights", insights }: ReportInsightBlockProps) {
  if (insights.length === 0) return null;
  return (
    <div className="space-y-4">
      {title && <h2 className="text-base font-semibold text-text-primary">{title}</h2>}
      <div className="space-y-3" role="list">
        {insights.map((insight) => (
          <div
            key={insight.id}
            role="listitem"
            className="rounded-xl border border-ai-200 bg-ai-50 p-5 dark:border-ai-700/30 dark:bg-ai-900/10"
          >
            <div className="mb-2 flex items-center gap-2">
              {ICONS[insight.type]}
              <span className="text-xs font-semibold uppercase tracking-wide text-ai-600 dark:text-ai-400">
                {TYPE_LABELS[insight.type]}
              </span>
              {insight.score !== undefined && (
                <span className="ml-auto rounded-full bg-ai-100 px-2.5 py-0.5 text-xs font-bold text-ai-700 dark:bg-ai-800/40 dark:text-ai-300">
                  {insight.score}%
                </span>
              )}
            </div>
            <h3 className="mb-1.5 text-sm font-semibold text-text-primary">{insight.title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{insight.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
