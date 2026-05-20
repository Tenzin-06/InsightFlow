import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealthCheck } from "@/hooks/api/use-health-check";

export default function DashboardPage() {
  const { data, isLoading, isError } = useHealthCheck();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary">Welcome to InsightFlow</p>
      </div>

      <Card className="w-fit">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-text-secondary">API Status</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-text-secondary">Connecting to API…</p>}
          {isError && (
            <p className="text-sm text-destructive font-medium">Unable to connect to API</p>
          )}
          {data && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              Backend Connected Successfully
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Surveys", "Responses", "Campaigns", "Completion Rate"].map((label) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-text-primary">—</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
