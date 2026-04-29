"use client";

import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";

interface FadeInProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

/**
 * Scroll-triggered lift animation. Opacity stays at 1 so content is never
 * accidentally hidden if intersection observers fail to fire.
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, {
    once: true,
    amount: "some",
    margin: "0px 0px 15% 0px",
  });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 1, y: 28 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 28 }
      }
      transition={{
        duration: MOTION_DURATION.slow,
        ease: MOTION_EASE,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
