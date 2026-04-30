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
  ringPct: number;
  icon: React.ReactNode;
}

const IMPACT_STATS: StatConfig[] = [
  {
    value: 99.9, decimals: 1, suffix: "%", label: "Platform Uptime", prefix: "", ringPct: 99,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-7.5-1.5a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Zm1 0a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4Z" clipRule="evenodd" /></svg>,
  },
  {
    value: 60, decimals: 0, suffix: "+", label: "Modules Shipped", prefix: "", ringPct: 72,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3ZM2 8.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1ZM3 12a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H3Z" /></svg>,
  },
  {
    value: 35, decimals: 0, suffix: "%", label: "Faster Deployments", prefix: "−", ringPct: 68,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M11.5 8a3.5 3.5 0 0 0 3.362-4.476c-.094-.325-.479-.39-.752-.117l-1.615 1.615a.25.25 0 0 1-.354 0l-.938-.938a.25.25 0 0 1 0-.354l1.615-1.615c.273-.273.208-.658-.117-.752A3.5 3.5 0 0 0 8 5.026L4.28 3.102a2.25 2.25 0 0 0-3.178 3.178L3 10a3.5 3.5 0 0 0 6.994-.495L13.5 13H14a.75.75 0 0 0 0-1.5h-.5L10.004 9.005A3.5 3.5 0 0 0 11.5 8Z" clipRule="evenodd" /></svg>,
  },
  {
    value: 55, decimals: 0, suffix: "%", label: "Conversion Window Cut", prefix: "−", ringPct: 78,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M11.722 1.174a.5.5 0 0 1 .128.686A9.501 9.501 0 0 1 8.5 5.83V8a.5.5 0 0 1-.5.5H5a.5.5 0 0 1 0-1h2.5V5.83A9.501 9.501 0 0 1 4.15 1.86a.5.5 0 1 1 .816.578A8.5 8.5 0 0 0 7.5 4.83V2a.5.5 0 0 1 1 0v2.83a8.501 8.501 0 0 0 2.534-2.392.5.5 0 0 1 .688-.264ZM8 11a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 11Z" clipRule="evenodd" /></svg>,
  },
  {
    value: 1000, decimals: 0, suffix: "+", label: "Interactions / min", prefix: "", ringPct: 84,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v.5h12v-.5A2.5 2.5 0 0 0 11.5 2h-7ZM2 6v4.5A2.5 2.5 0 0 0 4.5 13h7a2.5 2.5 0 0 0 2.5-2.5V6H2Z" /></svg>,
  },
  {
    value: 100, decimals: 0, suffix: "k+", label: "Daily Comms", prefix: "", ringPct: 90,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5"><path d="M1 8.74c0 .983.713 1.825 1.69 1.943L3 10.761V13a1 1 0 0 0 1.581.814l2.08-1.385c.21.069.428.127.654.17L8 13a1 1 0 0 0 1-.953A6 6 0 0 0 8 1a6 6 0 0 0-6 6v1.74Z" /></svg>,
  },
];

const R = 17;
const CIRCUMFERENCE = 2 * Math.PI * R;

function CircularRing({ pct, isVisible, delay }: { pct: number; isVisible: boolean; delay: number }) {
  const offset = CIRCUMFERENCE * (1 - pct / 100);
  return (
    <svg
      className="-rotate-90 absolute inset-0 h-full w-full"
      viewBox="0 0 40 40"
      aria-hidden
    >
      <defs>
        <linearGradient id={`rg-${pct}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle cx="20" cy="20" r={R} fill="none" stroke="rgba(34,211,238,0.09)" strokeWidth="1.5" />
      {/* Progress arc */}
      <motion.circle
        cx="20"
        cy="20"
        r={R}
        fill="none"
        stroke={`url(#rg-${pct})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        initial={{ strokeDashoffset: CIRCUMFERENCE }}
        animate={{ strokeDashoffset: isVisible ? offset : CIRCUMFERENCE }}
        transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      />
    </svg>
  );
}

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
      initial={prefersReducedMotion ? false : { opacity: 0, y: 56, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 56, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 1.1, delay: index * 0.08 }}
    >
      {/* Icon with animated circular progress ring */}
      <div className="relative flex h-10 w-10 items-center justify-center">
        {!prefersReducedMotion && (
          <CircularRing pct={stat.ringPct} isVisible={isInView} delay={index * 0.07 + 0.3} />
        )}
        {/* Ping ring on completion */}
        {!prefersReducedMotion && isInView && (
          <span
            className="absolute inset-0 rounded-full border border-cyan-400/30"
            style={{ animation: `ring-ping 1.8s ease-out ${index * 0.07 + 1.9}s 1 both` }}
          />
        )}
        <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-400">
          {stat.icon}
        </div>
      </div>

      <span className="stat-gradient-text text-xl font-bold tabular-nums tracking-tight sm:text-2xl lg:text-3xl">
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
