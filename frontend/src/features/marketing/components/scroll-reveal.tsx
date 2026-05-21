import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "fade" | "left" | "right";
  threshold?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const safeThreshold = Math.min(1, Math.max(0, threshold || 0));
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        // intentionally NOT disconnecting — re-triggers every scroll pass
      },
      { threshold: safeThreshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const initial: React.CSSProperties = {
    opacity: 0,
    transform: reducedMotion
      ? "none"
      : direction === "up"
      ? "translateY(24px)"
      : direction === "left"
      ? "translateX(-24px)"
      : direction === "right"
      ? "translateX(24px)"
      : "none",
  };

  const revealed: React.CSSProperties = {
    opacity: 1,
    transform: "translate(0)",
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={
        reducedMotion
          ? { opacity: visible ? 1 : 0, transition: "none" }
          : {
              ...(visible ? revealed : initial),
              // animate IN smoothly; reset instantly when leaving so the next entry feels fresh
              transition: visible
                ? `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`
                : "none",
              willChange: "opacity, transform",
            }
      }
    >
      {children}
    </div>
  );
}
