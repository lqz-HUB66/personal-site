"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ScanningLine from "./scanning-line";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <ScanningLine />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, clipPath: "inset(4% 0 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
          exit={{ opacity: 0, clipPath: "inset(0 0 4% 0)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
