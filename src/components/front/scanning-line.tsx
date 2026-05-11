"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ScanningLine() {
  const pathname = usePathname();
  const [scan, setScan] = useState(false);

  useEffect(() => {
    setScan(true);
    // Dispatch grid flash event
    window.dispatchEvent(new CustomEvent("grid-flash"));
    const t = setTimeout(() => setScan(false), 500);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {scan && (
        <motion.div
          key={pathname + "-scan"}
          initial={{ top: 0, opacity: 1 }}
          animate={{ top: "100%", opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-0 right-0 h-[2px] z-[60] pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.8)",
            boxShadow: "0 0 12px 2px rgba(255,255,255,0.3), 0 0 30px 4px rgba(255,255,255,0.1)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
