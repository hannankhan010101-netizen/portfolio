"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MOTION_EASE } from "@/constants/motion";

interface StatConfig {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  prefix: string;
  icon: React.ReactNode;
}

const IMPACT_STATS: StatConfig[] = [
  {
    value: 99.9, decimals: 1, suffix: "%", label: "Platform Uptime", prefix: "",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-7.5-1.5a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Zm1 0a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Z" clipRule="evenodd" /></svg>,
  },
  {
    value: 60, decimals: 0, suffix: "+", label: "Modules Shipped", prefix: "",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3ZM2 8.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1ZM3 12a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3Z" /></svg>,
  },
  {
    value: 35, decimals: 0, suffix: "%", label: "Faster Deployments", prefix: "−",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M11.5 8a3.5 3.5 0 0 0 3.362-4.476c-.094-.325-.479-.39-.752-.117l-1.615 1.615a.25.25 0 0 1-.354 0l-.938-.938a.25.25 0 0 1 0-.354l1.615-1.615c.273-.273.208-.658-.117-.752A3.5 3.5 0 0 0 8 5.026L4.28 3.102a2.25 2.25 0 0 0-3.178 3.178L3 10a3.5 3.5 0 0 0 6.994-.495L13.5 13H14a.75.75 0 0 0 0-1.5h-.5L10.004 9.005A3.5 3.5 0 0 0 11.5 8Z" clipRule="evenodd" /></svg>,
  },
  {
    value: 55, decimals: 0, suffix: "%", label: "Conversion Window Cut", prefix: "−",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M11.722 1.174a.5.5 0 0 1 .128.686A9.501 9.501 0 0 1 8.5 5.83V8a.5.5 0 0 1-.5.5H5a.5.5 0 0 1 0-1h2.5V5.83A9.501 9.501 0 0 1 4.15 1.86a.5.5 0 1 1 .816.578A8.5 8.5 0 0 0 7.5 4.83V2a.5.5 0 0 1 1 0v2.83a8.501 8.501 0 0 0 2.534-2.392.5.5 0 0 1 .688-.264ZM8 11a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 11Z" clipRule="evenodd" /></svg>,
  },
  {
    value: 1000, decimals: 0, suffix: "+", label: "Interactions / min", prefix: "",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v.5h12v-.5A2.5 2.5 0 0 0 11.5 2h-7ZM2 6v4.5A2.5 2.5 0 0 0 4.5 13h7a2.5 2.5 0 0 0 2.5-2.5V6H2Z" /></svg>,
  },
  {
    value: 100, decimals: 0, suffix: "k+", label: "Daily Comms", prefix: "",
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path d="M1 8.74c0 .983.713 1.825 1.69 1.943L3 10.761V13a1 1 0 0 0 1.581.814l2.08-1.385c.21.069.428.127.654.17L8 13a1 1 0 0 0 1-.953A6 6 0 0 0 8 1a6 6 0 0 0-6 6v1.74Z" /></svg>,
  },
];

function useCountUp(target: number, decimals: number, enabled: boolean) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const duration = 1800;
    const startTime = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimated(parseFloat((ease * target).toFixed(decimals)));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, decimals, enabled]);

  return enabled ? animated : target;
}

function StatItem({ stat, index, isInView }: { stat: StatConfig; index: number; isInView: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const count = useCountUp(stat.value, stat.decimals, isInView && !prefersReducedMotion);
  const displayValue = stat.decimals > 0 ? count.toFixed(stat.decimals) : Math.round(count).toString();

  return (
    <motion.div
      className="group flex flex-col items-center gap-3 text-center"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: MOTION_EASE }}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-400">
        {stat.icon}
      </div>
      <span className="stat-gradient-text text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">
        {stat.prefix}
        {prefersReducedMotion ? stat.value : displayValue}
        {stat.suffix}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {stat.label}
      </span>
    </motion.div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="relative overflow-hidden border-y border-white/[0.07] bg-zinc-950 py-12">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_100%_at_50%_50%,rgba(34,211,238,0.055),transparent_65%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {IMPACT_STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </div>
  );
}
