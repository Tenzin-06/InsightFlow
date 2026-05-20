export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border-default bg-bg-secondary p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-sm text-text-secondary">Sign in to your InsightFlow account</p>
        </div>
        <p className="text-center text-sm text-text-muted">Authentication coming in Unit 6</p>
      </div>
    </div>
  );
}
