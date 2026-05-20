import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-bg-secondary rounded-[14px] border border-border-default px-8 py-8",
        "shadow-[0_4px_12px_rgba(15,23,42,0.06)]",
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
