"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./logo";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/honors", label: "HONORS" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/blog", label: "BLOG" },
  { href: "/ctf", label: "CTF" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-transparent transition-[border-color] duration-300 ${
        scrolled ? "border-b border-[#222]" : "border-b border-transparent"
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="logo-container flex items-center shrink-0">
          <Logo />
        </Link>

        {/* Center: Nav links (desktop) */}
        <ul className="hidden md:flex items-center gap-0">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="nav-link relative px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.05em] transition-colors"
              >
                <span
                  className={
                    isActive(item.href) ? "text-white" : "text-[#666] hover:text-white"
                  }
                >
                  {item.label}
                </span>
                <span className={`nav-underline ${isActive(item.href) ? "nav-underline-active" : ""}`} />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: System info */}
        <div className="hidden md:flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.05em] text-[#333]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22c55e] system-dot" />
            READY
          </span>
          <span className="font-mono text-[10px] tracking-[0.05em] text-[#333] tabular-nums">
            {time}
          </span>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[#555] hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#222] bg-black">
          <ul className="px-6 py-3 space-y-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 font-mono text-xs uppercase tracking-[0.05em] transition-colors ${
                    isActive(item.href) ? "text-white" : "text-[#666] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-[#1a1a1a] mt-2">
              <div className="flex items-center gap-2 px-3 py-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22c55e] system-dot" />
                <span className="font-mono text-[10px] tracking-[0.05em] text-[#333]">
                  SYSTEM READY
                </span>
                <span className="font-mono text-[10px] tracking-[0.05em] text-[#333] tabular-nums ml-auto">
                  {time}
                </span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
