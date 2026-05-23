import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface ConversationHeaderProps {
  title: string;
}

/**
 * ConversationHeader
 *
 * Slim top bar displaying the survey title and a close/exit link.
 * Stays fixed at the top of the conversation container.
 */
export function ConversationHeader({ title }: ConversationHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border-soft bg-bg-secondary px-4 py-3 shadow-sm">
      {/* InsightFlow brand mark */}
      <span className="text-xs font-semibold text-primary-500">InsightFlow</span>

      {/* Survey title — truncated for long names */}
      <h1
        className="max-w-[60%] truncate text-sm font-semibold text-text-primary"
        title={title}
      >
        {title}
      </h1>

      {/* Exit — returns to home without losing the survey link */}
      <Link
        to="/"
        aria-label="Exit survey"
        className="flex h-7 w-7 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-hover hover:text-text-secondary"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </Link>
    </header>
  );
}
