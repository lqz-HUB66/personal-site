"use client";

import { useRef, useCallback } from "react";
import { dispatchGridRipple } from "./grid-ripple";

interface GridCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GridCard({ children, className = "" }: GridCardProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onMouseEnter = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    dispatchGridRipple(cx, cy);
    intervalRef.current = setInterval(() => {
      dispatchGridRipple(cx, cy);
    }, 200);
  }, []);

  const onMouseLeave = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return (
    <div
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
