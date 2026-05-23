import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
};

/**
 * Responsive analytics grid used to arrange chart/widget cards.
 * Defaults to a 2-column layout on large screens.
 */
export function AnalyticsGrid({ children, cols = 2, className }: Props) {
  const colClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 3
        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        : "grid-cols-1 lg:grid-cols-2";

  return (
    <div className={cn("grid gap-5", colClass, className)}>
      {children}
    </div>
  );
}
