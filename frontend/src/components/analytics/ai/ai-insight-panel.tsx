import { AISummaryCard } from "./ai-summary-card"
import { QualityScoreWidget } from "./quality-score-widget"
import { SentimentWidget } from "./sentiment-widget"

type CombinedInsights = {
  key_findings: string[]
  data_quality: string
  ai_summary_available: boolean
  ai_sentiment_available: boolean
  ai_quality_available: boolean
}

type Props = {
  summary?: Parameters<typeof AISummaryCard>[0]["data"]
  sentiment?: Parameters<typeof SentimentWidget>[0]["data"]
  quality?: Parameters<typeof QualityScoreWidget>[0]["data"]
  combinedInsights?: CombinedInsights
  isLoading?: boolean
}

export function AIInsightPanel({
  summary,
  sentiment,
  quality,
  combinedInsights,
  isLoading,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">AI-Powered Insights</h3>

        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          Beta
        </span>
      </div>

      {combinedInsights?.key_findings &&
        combinedInsights.key_findings.length > 0 && (
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Key Findings
            </p>

            <ul className="space-y-1">
              {combinedInsights.key_findings.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-primary">*</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AISummaryCard data={summary} isLoading={isLoading} />

        <SentimentWidget data={sentiment} isLoading={isLoading} />

        <QualityScoreWidget data={quality} isLoading={isLoading} />
      </div>
    </div>
  )
}
