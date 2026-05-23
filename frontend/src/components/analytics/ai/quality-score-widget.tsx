import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type QualityData = {
  available: boolean
  average_score: number
  high_quality_count: number
  medium_quality_count: number
  low_quality_count: number
  suspicious_count: number
  response_count: number
}

type Props = { data?: QualityData; isLoading?: boolean }

export function QualityScoreWidget({ data, isLoading }: Props) {
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
            Quality
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">No quality data yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Response Quality
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-2xl font-bold">
          {data.average_score.toFixed(0)}
          <span className="text-sm font-normal text-muted-foreground">
            /100
          </span>
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-green-600">High</span>
            <span>{data.high_quality_count}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-yellow-600">Medium</span>
            <span>{data.medium_quality_count}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-red-500">Low</span>
            <span>{data.low_quality_count}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Suspicious</span>
            <span>{data.suspicious_count}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {data.response_count} responses evaluated
        </p>
      </CardContent>
    </Card>
  )
}
