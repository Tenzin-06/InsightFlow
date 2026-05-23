import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Outer shell for analytics pages — stacks sections with consistent spacing.
 */
export function AnalyticsShell({ children, className }: Props) {
  return (
    <div className={cn("space-y-6", className)} role="main">
      {children}
    </div>
  );
}
