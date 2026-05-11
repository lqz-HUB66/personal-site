"use client";

import { useEffect, useRef } from "react";

export default function AdminGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Listen on the parent <main> so events aren't blocked by content
    const parent = canvas.parentElement;
    if (!parent) return;

    const GRID = 60;
    const GLOW_RADIUS = 300;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = devicePixelRatio;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top + parent.scrollTop,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx < 0 || my < 0) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += GRID) {
        const dy = Math.abs(y - my);
        if (dy > GLOW_RADIUS) continue;
        const alpha = (1 - dy / GLOW_RADIUS) * 0.12;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Vertical lines
      for (let x = 0; x <= width; x += GRID) {
        const dx = Math.abs(x - mx);
        if (dx > GLOW_RADIUS) continue;
        const alpha = (1 - dx / GLOW_RADIUS) * 0.12;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Intersection glow dots
      const nearX = Math.round(mx / GRID) * GRID;
      const nearY = Math.round(my / GRID) * GRID;

      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          const ix = nearX + dx * GRID;
          const iy = nearY + dy * GRID;
          const dist = Math.sqrt((ix - mx) ** 2 + (iy - my) ** 2);
          if (dist > GLOW_RADIUS) continue;

          const intensity = (1 - dist / GLOW_RADIUS) * 0.25;
          ctx.beginPath();
          ctx.arc(ix, iy, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${intensity})`;
          ctx.fill();
        }
      }

      // Central glow circle
      const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, GLOW_RADIUS);
      gradient.addColorStop(0, "rgba(255,255,255,0.03)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(mx - GLOW_RADIUS, my - GLOW_RADIUS, GLOW_RADIUS * 2, GLOW_RADIUS * 2);

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
