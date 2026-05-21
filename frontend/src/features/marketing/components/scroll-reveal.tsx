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

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        // intentionally NOT disconnecting — re-triggers every scroll pass
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const initial: React.CSSProperties = {
    opacity: 0,
    transform:
      direction === "up"
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
      style={{
        ...(visible ? revealed : initial),
        // animate IN smoothly; reset instantly when leaving so the next entry feels fresh
        transition: visible
          ? `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`
          : "none",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
