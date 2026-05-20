interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="space-y-1 mb-5">
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
      {subtitle && (
        <p className="text-sm text-text-secondary">{subtitle}</p>
      )}
    </div>
  );
}
