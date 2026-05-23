import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Render header action slot (e.g. a small badge or button) */
  action?: React.ReactNode;
};

/**
 * Standard analytics widget card — wraps any chart or table in a
 * consistent header/content/footer layout.
 */
export function AnalyticsCard({
  title,
  description,
  children,
  footer,
  className,
  action,
}: Props) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b border-border-soft pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold text-text-primary">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-0.5 text-xs">
                {description}
              </CardDescription>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </CardHeader>

      <CardContent className="pt-4">{children}</CardContent>

      {footer && (
        <div className="border-t border-border-soft bg-muted/30 px-4 py-3 text-xs text-text-muted">
          {footer}
        </div>
      )}
    </Card>
  );
}
