"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { SkillBarItem } from "@/types/skills.types";

function getTier(percent: number) {
  if (percent >= 90) return { label: "Expert", color: "cyan" } as const;
  if (percent >= 80) return { label: "Advanced", color: "emerald" } as const;
  return { label: "Proficient", color: "zinc" } as const;
}

const TIER_STYLES = {
  cyan: {
    accent: "bg-cyan-400",
    glow: "0 0 8px rgba(34,211,238,0.75)",
    dot: "bg-cyan-400",
    text: "text-cyan-400",
  },
  emerald: {
    accent: "bg-emerald-400",
    glow: "0 0 8px rgba(52,211,153,0.7)",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
  },
  zinc: {
    accent: "bg-zinc-500",
    glow: "none",
    dot: "bg-zinc-500",
    text: "text-zinc-500",
  },
} as const;

export function SkillBar({ item, index = 0 }: { item: SkillBarItem; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: "some" });
  const prefersReducedMotion = useReducedMotion();
  const { label, color } = getTier(item.percent);
  const styles = TIER_STYLES[color];
  const filledDots = label === "Expert" ? 3 : label === "Advanced" ? 2 : 1;
  const show = isInView || prefersReducedMotion;

  return (
    <motion.div
      ref={ref}
      className="group/row flex items-center gap-3 border-b border-white/[0.045] py-2.5 last:border-0"
      initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
      animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.04 }}
    >
      {/* Tier accent */}
      <motion.div
        className={`w-[3px] flex-none rounded-full ${styles.accent}`}
        initial={{ height: 0 }}
        animate={show ? { height: 18 } : { height: 0 }}
        transition={{ duration: 0.36, ease: "easeOut", delay: index * 0.04 + 0.06 }}
        style={{ boxShadow: styles.glow }}
      />

      {/* Skill name */}
      <span className="flex-1 text-sm font-medium text-zinc-300 transition-colors duration-150 group-hover/row:text-zinc-100">
        {item.label}
      </span>

      {/* Pip dots */}
      <div className="flex items-center gap-[5px]">
        {[1, 2, 3].map((pip) => (
          <div
            key={pip}
            className={`h-[5px] w-[5px] rounded-full transition-colors duration-200 ${
              pip <= filledDots ? styles.dot : "bg-zinc-700"
            }`}
          />
        ))}
      </div>

      {/* Tier label */}
      <span className={`w-16 text-right text-[10px] font-bold uppercase tracking-[0.14em] ${styles.text}`}>
        {label}
      </span>
    </motion.div>
  );
}
