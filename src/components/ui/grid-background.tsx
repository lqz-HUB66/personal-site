"use client";

import { useEffect, useRef } from "react";

interface Ripple {
  x: number;
  y: number;
  t: number;
}

interface Glint {
  x: number;
  y: number;
  t: number;
  life: number;
}

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(0);
  const startTimeRef = useRef(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const glintsRef = useRef<Glint[]>([]);
  const lastRippleRef = useRef(0);
  const lastGlintRef = useRef(0);
  const flashRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const noiseCanvas = noiseCanvasRef.current;
    if (!canvas || !noiseCanvas) return;
    const ctx = canvas.getContext("2d");
    const noiseCtx = noiseCanvas.getContext("2d");
    if (!ctx || !noiseCtx) return;

    const GRID = 50;
    const BLOOM_DURATION = 2200;
    const MOUSE_GLOW_RADIUS = 200;
    const RIPPLE_INTERVAL = 90;
    const GLINT_INTERVAL = 40;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let noiseGenerated = false;

    const resize = () => {
      dpr = devicePixelRatio;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Noise canvas
      noiseCanvas.width = Math.ceil(width / 2);
      noiseCanvas.height = Math.ceil(height / 2);
      noiseCanvas.style.width = width + "px";
      noiseCanvas.style.height = height + "px";
      noiseGenerated = false;
    };

    const generateNoise = () => {
      const nw = noiseCanvas.width;
      const nh = noiseCanvas.height;
      const imageData = noiseCtx.createImageData(nw, nh);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 8; // very low opacity
      }
      noiseCtx.putImageData(imageData, 0, 0);
      noiseGenerated = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onGridRipple = (e: Event) => {
      const detail = (e as CustomEvent<{ x: number; y: number }>).detail;
      if (detail) {
        ripplesRef.current.push({ x: detail.x, y: detail.y, t: performance.now() });
      }
    };

    const onGridFlash = () => {
      flashRef.current = performance.now();
    };

    // Scroll-based fade factor: 1 at top, 0 at bottom
    const getScrollFade = (y: number): number => {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const absoluteY = y + scrollY;
      const fadeStart = viewportH * 0.3;
      const fadeEnd = viewportH * 1.8;
      if (absoluteY < fadeStart) return 1;
      if (absoluteY > fadeEnd) return 0;
      return 1 - (absoluteY - fadeStart) / (fadeEnd - fadeStart);
    };

    const draw = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      if (!noiseGenerated) generateNoise();

      const elapsed = now - startTimeRef.current;
      const bloom = Math.min(elapsed / BLOOM_DURATION, 1);
      const eased = 1 - Math.pow(1 - bloom, 3);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Add ripples
      if (mx > 0 && my > 0 && now - lastRippleRef.current > RIPPLE_INTERVAL) {
        ripplesRef.current.push({ x: mx, y: my, t: now });
        lastRippleRef.current = now;
      }
      ripplesRef.current = ripplesRef.current.filter((r) => now - r.t < 1400);

      // Add glints near mouse at grid intersections
      if (mx > 0 && my > 0 && now - lastGlintRef.current > GLINT_INTERVAL) {
        const nearX = Math.round(mx / GRID) * GRID;
        const nearY = Math.round(my / GRID) * GRID;
        const jitterX = (Math.random() - 0.5) * GRID * 2;
        const jitterY = (Math.random() - 0.5) * GRID * 2;
        const gx = nearX + jitterX;
        const gy = nearY + jitterY;
        const dist = Math.sqrt((gx - mx) ** 2 + (gy - my) ** 2);
        if (dist < MOUSE_GLOW_RADIUS * 1.5) {
          glintsRef.current.push({
            x: gx,
            y: gy,
            t: now,
            life: 300 + Math.random() * 500,
          });
          lastGlintRef.current = now;
        }
      }
      glintsRef.current = glintsRef.current.filter((g) => now - g.t < g.life);

      const baseAlpha = 0.035;

      // Flash boost: briefly brighten all grid lines on page transition
      let flashBoost = 0;
      if (flashRef.current > 0) {
        const flashAge = (now - flashRef.current) / 1000;
        if (flashAge < 0.6) {
          flashBoost = (1 - flashAge / 0.6) * 0.15;
        }
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += GRID) {
        const scrollFade = getScrollFade(y);
        if (scrollFade < 0.01) continue;

        const dy = Math.abs(y - cy);
        const maxHalfW = Math.sqrt(Math.max(0, (height / 2) ** 2 - dy ** 2));
        const halfW = maxHalfW * eased;
        if (halfW < 1) continue;

        const x0 = Math.max(0, cx - halfW);
        const x1 = Math.min(width, cx + halfW);

        let alpha = (baseAlpha + flashBoost) * scrollFade;

        // Mouse glow
        const dMouseY = Math.abs(y - my);
        if (dMouseY < MOUSE_GLOW_RADIUS) {
          alpha += (1 - dMouseY / MOUSE_GLOW_RADIUS) * 0.12 * scrollFade;
        }

        // Ripples
        for (const ripple of ripplesRef.current) {
          const age = (now - ripple.t) / 1000;
          const waveR = age * 380;
          const waveW = 90;
          const d = Math.abs(y - ripple.y);
          const wd = Math.abs(d - waveR);
          if (wd < waveW) {
            alpha += Math.max(0, (1 - wd / waveW) * (1 - age / 1.4)) * 0.1;
          }
        }

        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        ctx.strokeStyle = `rgba(255,255,255,${Math.min(alpha, 0.3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Vertical lines
      for (let x = 0; x <= width; x += GRID) {
        const scrollFade = Math.min(getScrollFade(0), getScrollFade(height));
        if (scrollFade < 0.01) continue;

        const dx = Math.abs(x - cx);
        const maxHalfH = Math.sqrt(Math.max(0, (width / 2) ** 2 - dx ** 2));
        const halfH = maxHalfH * eased;
        if (halfH < 1) continue;

        const y0 = Math.max(0, cy - halfH);
        const y1 = Math.min(height, cy + halfH);

        let alpha = (baseAlpha + flashBoost) * scrollFade;

        const dMouseX = Math.abs(x - mx);
        if (dMouseX < MOUSE_GLOW_RADIUS) {
          alpha += (1 - dMouseX / MOUSE_GLOW_RADIUS) * 0.12 * scrollFade;
        }

        for (const ripple of ripplesRef.current) {
          const age = (now - ripple.t) / 1000;
          const waveR = age * 380;
          const waveW = 90;
          const d = Math.abs(x - ripple.x);
          const wd = Math.abs(d - waveR);
          if (wd < waveW) {
            alpha += Math.max(0, (1 - wd / waveW) * (1 - age / 1.4)) * 0.1;
          }
        }

        ctx.beginPath();
        ctx.moveTo(x, y0);
        ctx.lineTo(x, y1);
        ctx.strokeStyle = `rgba(255,255,255,${Math.min(alpha, 0.3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Glints (sparkle dots)
      for (const glint of glintsRef.current) {
        const age = (now - glint.t) / glint.life;
        const scrollFade = getScrollFade(glint.y);
        if (scrollFade < 0.01) continue;
        // Fade in then out
        const intensity = age < 0.2 ? age / 0.2 : 1 - (age - 0.2) / 0.8;
        const alpha = intensity * 0.6 * scrollFade;
        const size = 1 + intensity * 1.5;
        ctx.beginPath();
        ctx.arc(glint.x, glint.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("grid-ripple", onGridRipple);
    window.addEventListener("grid-flash", onGridFlash);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("grid-ripple", onGridRipple);
      window.removeEventListener("grid-flash", onGridFlash);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />
      <canvas
        ref={noiseCanvasRef}
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
        aria-hidden="true"
        style={{ mixBlendMode: "screen" }}
      />
    </>
  );
}
