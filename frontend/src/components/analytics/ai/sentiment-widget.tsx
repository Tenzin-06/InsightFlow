import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type SentimentData = {
  available: boolean
  dominant_sentiment: string | null
  sentiment_distribution: {
    positive?: number
    neutral?: number
    negative?: number
  }
  overall_confidence: number
  response_count: number
}

type Props = { data?: SentimentData; isLoading?: boolean }

const COLORS: Record<string, string> = {
  positive: "bg-green-500",
  neutral: "bg-yellow-400",
  negative: "bg-red-500",
}

export function SentimentWidget({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data?.available) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Sentiment
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">No sentiment data yet.</p>
        </CardContent>
      </Card>
    )
  }

  const dist = data.sentiment_distribution ?? {}

  const bars = [
    { label: "Positive", value: dist.positive ?? 0, color: COLORS.positive },
    { label: "Neutral", value: dist.neutral ?? 0, color: COLORS.neutral },
    { label: "Negative", value: dist.negative ?? 0, color: COLORS.negative },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Sentiment Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground capitalize">
          Dominant:
          <span className="font-medium text-foreground">
            {" "}
            {data.dominant_sentiment}
          </span>
        </p>

        <div className="flex h-4 gap-1 overflow-hidden rounded">
          {bars.map((b) => (
            <div
              key={b.label}
              className={b.color}
              style={{ width: `${b.value * 100}%` }}
              title={`${b.label}: ${Math.round(b.value * 100)}%`}
            />
          ))}
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground">
          {bars.map((b) => (
            <span key={b.label}>
              {b.label}: {Math.round(b.value * 100)}%
            </span>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Confidence: {Math.round(data.overall_confidence * 100)}%
        </p>
      </CardContent>
    </Card>
  )
}
