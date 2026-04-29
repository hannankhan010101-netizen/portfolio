"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="fixed left-0 top-0 z-[100] h-[2px] w-full origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #22d3ee 0%, #34d399 50%, #22d3ee 100%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}
