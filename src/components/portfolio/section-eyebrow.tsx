"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";

interface SectionEyebrowProps {
  readonly children: string;
}

/**
 * Uppercase section label with an animated accent line.
 */
export function SectionEyebrow({ children }: SectionEyebrowProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: "some" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="flex items-center gap-3">
      <motion.span
        className="h-px w-12 origin-left bg-gradient-to-r from-cyan-400/90 to-cyan-400/0"
        initial={prefersReducedMotion ? false : { scaleX: 0 }}
        animate={
          prefersReducedMotion ? undefined : isInView ? { scaleX: 1 } : { scaleX: 0 }
        }
        transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE }}
      />
      <motion.p
        className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400"
        initial={prefersReducedMotion ? false : { opacity: 0.6, x: -6 }}
        animate={
          prefersReducedMotion
            ? undefined
            : isInView
              ? { opacity: 1, x: 0 }
              : { opacity: 0.6, x: -6 }
        }
        transition={{ duration: MOTION_DURATION.medium, ease: MOTION_EASE }}
      >
        {children}
      </motion.p>
    </div>
  );
}
