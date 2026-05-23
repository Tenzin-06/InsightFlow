import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type AISummaryData = {
  available: boolean
  summary: string
  themes: string[]
  response_count: number
  generated_at?: string | null
}

type Props = { data?: AISummaryData; isLoading?: boolean }

export function AISummaryCard({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data?.available) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            AI Summary
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            No AI summary available yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">AI Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed">{data.summary}</p>

        {data.themes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.themes.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Based on {data.response_count} responses
        </p>
      </CardContent>
    </Card>
  )
}
