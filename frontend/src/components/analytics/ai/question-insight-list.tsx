import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type QuestionInsight = {
  question_id: number
  question_text: string
  themes: string[]
  sentiment_summary: string
  friction_indicators: string[]
  answer_diversity: {
    description?: string
    diversity_level?: string
  }
  answer_count: number
}

type Props = {
  insights?: QuestionInsight[]
  isLoading?: boolean
}

export function QuestionInsightList({ insights, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!insights || insights.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No question insights available yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {insights.map((q) => (
        <Card key={q.question_id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {q.question_text}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {q.themes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {q.themes.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            )}

            {q.sentiment_summary && (
              <p className="text-xs text-muted-foreground">
                {q.sentiment_summary}
              </p>
            )}

            {q.friction_indicators.length > 0 && (
              <div className="space-y-0.5 text-xs text-destructive">
                {q.friction_indicators.map((f, i) => (
                  <p key={i}>Warning: {f}</p>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {q.answer_count} answers - diversity:{" "}
              {q.answer_diversity?.diversity_level ?? "-"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
