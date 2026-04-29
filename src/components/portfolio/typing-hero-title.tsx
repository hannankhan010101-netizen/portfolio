"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HERO_TYPING_TITLES } from "@/constants/hero";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";

interface TypingHeroTitleProps {
  readonly className?: string;
}

/**
 * Crossfades between rotating titles with a calibrated caret pulse.
 */
export function TypingHeroTitle({ className }: TypingHeroTitleProps) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % HERO_TYPING_TITLES.length);
    }, 3200);

    return () => window.clearInterval(id);
  }, []);

  const current = HERO_TYPING_TITLES[index];

  return (
    <p
      className={`flex min-h-[1.5em] flex-wrap items-center gap-1 text-xl font-medium sm:text-2xl ${className ?? ""}`}
    >
      <span className="relative inline-flex min-h-[1.25em] items-center text-cyan-300">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={current}
            className="inline-block bg-gradient-to-r from-cyan-300 via-cyan-400 to-emerald-300/90 bg-clip-text text-transparent"
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: 10, filter: "blur(6px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, y: -10, filter: "blur(4px)" }
            }
            transition={{
              duration: prefersReducedMotion ? 0.15 : MOTION_DURATION.medium,
              ease: MOTION_EASE,
            }}
          >
            {current}
          </motion.span>
        </AnimatePresence>
        <motion.span
          className="ml-1 inline-block h-[1.1em] w-0.5 rounded-sm bg-cyan-400/90 align-middle"
          aria-hidden
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: [1, 0.2, 1] }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 1.05, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </span>
    </p>
  );
}
