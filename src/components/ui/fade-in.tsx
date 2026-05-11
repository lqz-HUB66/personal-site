"use client";

import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export default function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const translateMap = {
      up: "translateY(28px)",
      down: "translateY(-28px)",
      left: "translateX(28px)",
      right: "translateX(-28px)",
    };

    const reset = () => {
      el.style.opacity = "0";
      el.style.transform = translateMap[direction];
    };

    const show = () => {
      el.style.opacity = "1";
      el.style.transform = "translate(0, 0)";
    };

    // initial state
    el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
    reset();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
        } else {
          reset();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
