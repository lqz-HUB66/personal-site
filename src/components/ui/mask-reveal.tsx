"use client";

import { motion } from "framer-motion";

interface MaskRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export default function MaskReveal({ children, className = "", delay = 0 }: MaskRevealProps) {
  return (
    <motion.span
      className={`inline-block overflow-hidden ${className}`}
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: delay + 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
