/**
 * ConversationContainer
 *
 * Full-viewport flex-column wrapper for the conversational survey.
 * Provides:
 *  - 100dvh height (mobile-safe, avoids browser chrome overlap)
 *  - max-width centering for desktop readability
 *  - bg-bg-primary surface
 */
interface ConversationContainerProps {
  children: React.ReactNode;
}

export function ConversationContainer({ children }: ConversationContainerProps) {
  return (
    <div className="flex h-dvh flex-col bg-bg-primary">
      {/* Centered column — readable on desktop, full-width on mobile */}
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
        {children}
      </div>
    </div>
  );
}
