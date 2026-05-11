"use client";

export default function Logo() {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-9 w-auto"
      aria-label="LQZ Logo"
    >
      {/* ---- Reference lines (thin guide lines, behind everything) ---- */}
      <line x1="0" y1="35" x2="120" y2="35" stroke="#1a1a1a" strokeWidth="0.3" className="logo-ref-h" />
      <line x1="0" y1="40" x2="120" y2="40" stroke="#1a1a1a" strokeWidth="0.3" className="logo-ref-h" />
      <line x1="0" y1="10" x2="120" y2="10" stroke="#1a1a1a" strokeWidth="0.3" className="logo-ref-h" />
      <line x1="0" y1="45" x2="120" y2="45" stroke="#1a1a1a" strokeWidth="0.3" className="logo-ref-h" />
      <line x1="8" y1="0" x2="8" y2="60" stroke="#1a1a1a" strokeWidth="0.3" className="logo-ref-v" />

      {/* ---- Right arc with dots ---- */}
      <path
        d="M 112 15 A 22 22 0 0 1 112 49"
        stroke="#222"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        fill="none"
        className="logo-arc"
      />
      <circle cx="112" cy="15" r="1.2" fill="#333" className="logo-dot" />
      <circle cx="112" cy="49" r="1.2" fill="#333" className="logo-dot" />
      <circle cx="117" cy="22" r="0.8" fill="#222" className="logo-dot" />
      <circle cx="119" cy="30" r="0.8" fill="#222" className="logo-dot" />
      <circle cx="117" cy="38" r="0.8" fill="#222" className="logo-dot" />

      {/* ---- L ---- */}
      <path
        d="M 12 8 L 12 48 M 12 48 L 34 48"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="square"
        className="logo-letter"
      />

      {/* ---- Q circle ---- */}
      <circle
        cx="52"
        cy="28"
        r="14"
        stroke="#fff"
        strokeWidth="1.8"
        fill="none"
        className="logo-letter"
      />

      {/* ---- Q tail ---- */}
      <path
        d="M 55 32 L 65 48"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="square"
        className="logo-letter"
      />

      {/* ---- Z ---- */}
      <path
        d="M 75 8 L 95 8 M 95 8 L 75 48 L 95 48"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="square"
        className="logo-letter"
      />
    </svg>
  );
}
