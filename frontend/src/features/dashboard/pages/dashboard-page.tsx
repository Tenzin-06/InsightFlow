import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary">Welcome to InsightFlow</p>
      </div>
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
