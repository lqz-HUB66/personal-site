"use client";

import { useEffect, useState } from "react";

const HEX_CHARS = "0123456789abcdef";

function randomHex(len: number) {
  return Array.from({ length: len }, () =>
    HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
  ).join("");
}

export function HexLoader({ label = "LOADING" }: { label?: string }) {
  const [hex, setHex] = useState(randomHex(8));

  useEffect(() => {
    const id = setInterval(() => setHex(randomHex(8)), 120);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 hex-loading">
      <span>{label}</span>
      <span className="text-[#444]">0x{hex}</span>
      <span className="blink-cursor" />
    </div>
  );
}

export function TerminalSkeleton({ lines = 5 }: { lines?: number }) {
  return (
    <div className="space-y-3 font-mono">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 text-[11px]"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <span className="text-[#222] w-4 text-right">{String(i + 1).padStart(2, "0")}</span>
          <div
            className="h-2 rounded-full bg-[#111]"
            style={{ width: `${40 + Math.random() * 40}%` }}
          />
        </div>
      ))}
      <div className="flex items-center gap-2 pt-2 text-[10px] text-[#333]">
        <span className="blink-cursor" />
        <span>awaiting data</span>
      </div>
    </div>
  );
}
