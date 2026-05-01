"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import { SECTION_IDS } from "@/constants/section-ids";
import { SECTION_LABELS } from "@/constants/section-labels";
import { SectionEyebrow } from "@/components/portfolio/section-eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { MOTION_EASE } from "@/constants/motion";

const STEPS = [
  {
    id: "01",
    title: "Discovery & Architecture",
    description:
      "Understand your domain, constraints, and scale requirements before a line of code is written. Every decision is documented.",
    deliverables: ["System architecture diagram", "Tech-stack recommendation", "Risk & dependency map"],
    duration: "1 – 2 days",
    color: "cyan",
  },
  {
    id: "02",
    title: "Technical Specification",
    description:
      "API contracts, data models, integration points, and security requirements documented in full — so there are no surprises during build.",
    deliverables: ["OpenAPI / schema spec", "Database entity diagram", "Third-party integration plan"],
    duration: "2 – 3 days",
    color: "emerald",
  },
  {
    id: "03",
    title: "Iterative Build",
    description:
      "Sprint-based delivery. Working software after every cycle — you review, give feedback, and see real progress, not status updates.",
    deliverables: ["Weekly demo access", "Source code on GitHub", "Sprint progress report"],
    duration: "Ongoing cycles",
    color: "violet",
  },
  {
    id: "04",
    title: "Quality & Deployment",
    description:
      "Automated test suites, CI/CD pipelines, and zero-downtime production deploys with rollback safety built in from day one.",
    deliverables: ["Automated test suite", "CI/CD pipeline config", "Production deployment runbook"],
    duration: "1 – 2 days",
    color: "amber",
  },
  {
    id: "05",
    title: "Handover & Ongoing Support",
    description:
      "Post-launch monitoring, performance tuning, and documentation so your team owns the platform with full confidence.",
    deliverables: ["Full technical documentation", "30-day support window", "Knowledge-transfer session"],
    duration: "30+ days",
    color: "cyan",
  },
] as const;

const COLOR_MAP = {
  cyan: {
    dot: "bg-cyan-400",
    glow: "shadow-[0_0_10px_rgba(34,211,238,0.7)]",
    badge: "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-400",
    num: "text-cyan-400/30",
    hover: "hover:border-cyan-400/25",
    pill: "border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300",
  },
  emerald: {
    dot: "bg-emerald-400",
    glow: "shadow-[0_0_10px_rgba(52,211,153,0.7)]",
    badge: "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-400",
    num: "text-emerald-400/30",
    hover: "hover:border-emerald-400/25",
    pill: "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
  },
  violet: {
    dot: "bg-violet-400",
    glow: "shadow-[0_0_10px_rgba(167,139,250,0.7)]",
    badge: "border-violet-400/20 bg-violet-400/[0.06] text-violet-400",
    num: "text-violet-400/30",
    hover: "hover:border-violet-400/25",
    pill: "border-violet-400/15 bg-violet-400/[0.06] text-violet-300",
  },
  amber: {
    dot: "bg-amber-400",
    glow: "shadow-[0_0_10px_rgba(251,191,36,0.7)]",
    badge: "border-amber-400/20 bg-amber-400/[0.06] text-amber-400",
    num: "text-amber-400/30",
    hover: "hover:border-amber-400/25",
    pill: "border-amber-400/15 bg-amber-400/[0.06] text-amber-300",
  },
} as const;

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof STEPS)[number];
  index: number;
  isLast: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const c = COLOR_MAP[step.color];
  const fromLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex gap-6 md:gap-10">
      {/* Timeline spine */}
      <div className="relative flex flex-col items-center">
        {/* Dot */}
        <motion.div
          className={`relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full ${c.dot} ${c.glow}`}
          initial={prefersReducedMotion ? false : { scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", stiffness: 450, damping: 22, delay: index * 0.09 }}
        />
        {/* Connector line */}
        {!isLast && (
          <div className="relative mt-2 w-px flex-1 overflow-hidden bg-white/[0.06]">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400/40 to-transparent"
              initial={prefersReducedMotion ? false : { height: "0%" }}
              animate={inView ? { height: "100%" } : { height: "0%" }}
              transition={{ duration: 0.9, ease: MOTION_EASE, delay: index * 0.09 + 0.2 }}
            />
          </div>
        )}
      </div>

      {/* Card */}
      <motion.div
        className={`group mb-10 flex-1 rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-6 transition-colors duration-300 ${c.hover}`}
        initial={prefersReducedMotion ? false : { opacity: 0, x: fromLeft ? -18 : 18 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: fromLeft ? -18 : 18 }}
        transition={{ duration: 0.5, ease: MOTION_EASE, delay: index * 0.09 }}
        whileHover={prefersReducedMotion ? undefined : { y: -3 }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${c.badge.split(" ")[2]}`}>
              Step {step.id}
            </span>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-50">{step.title}</h3>
          </div>
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${c.badge}`}>
            {step.duration}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-zinc-400">{step.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {step.deliverables.map((d) => (
            <span key={d} className={`rounded-md border px-2.5 py-1 text-[11px] font-medium ${c.pill}`}>
              {d}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function ProcessSection() {
  return (
    <section
      id={SECTION_IDS.PROCESS}
      className="relative overflow-hidden border-b border-white/10 bg-zinc-950 py-14 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(34,211,238,0.05),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(52,211,153,0.04),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.3]" />

      <FadeIn>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">

          {/* Header */}
          <div className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <SectionEyebrow>{SECTION_LABELS.PROCESS}</SectionEyebrow>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                From Brief to Production
              </h2>
              <p className="max-w-lg text-base leading-relaxed text-zinc-400">
                A transparent, documented engagement model designed for teams that need certainty — not surprises.
              </p>
            </div>

            {/* Trust badge */}
            <div className="flex shrink-0 flex-col gap-2 rounded-xl border border-white/[0.07] bg-zinc-900/60 px-5 py-4 sm:items-end">
              <div className="flex items-center gap-2">
                <span className="glow-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">Available for new projects</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                Avg. onboarding &lt; 48 hrs
              </span>
            </div>
          </div>

          {/* Steps — two column on large screens */}
          <div className="grid gap-0 lg:grid-cols-2 lg:gap-x-16">
            {/* Left column: steps 1, 3, 5 */}
            <div>
              {STEPS.filter((_, i) => i % 2 === 0).map((step, idx) => (
                <StepCard
                  key={step.id}
                  step={step}
                  index={idx * 2}
                  isLast={idx * 2 === STEPS.length - 1}
                />
              ))}
            </div>
            {/* Right column: steps 2, 4 — offset on desktop */}
            <div className="lg:mt-16">
              {STEPS.filter((_, i) => i % 2 === 1).map((step, idx) => (
                <StepCard
                  key={step.id}
                  step={step}
                  index={idx * 2 + 1}
                  isLast={false}
                />
              ))}
            </div>
          </div>

          {/* CTA strip */}
          <motion.div
            className="mt-4 flex flex-col items-center gap-4 rounded-2xl border border-white/[0.07] bg-zinc-900/40 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: MOTION_EASE }}
          >
            <div>
              <p className="text-base font-semibold text-zinc-100">Ready to start the discovery call?</p>
              <p className="mt-1 text-sm text-zinc-500">No commitment. Just a 15-minute conversation about what you&apos;re building.</p>
            </div>
            <div className="flex flex-col gap-3 xs:flex-row">
              <motion.a
                href="#contact"
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-2.5 text-center text-sm font-bold text-zinc-950 xs:w-auto"
                whileHover={{ scale: 1.04, boxShadow: "0 0 24px -4px rgba(34,211,238,0.6)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
              >
                Let&apos;s Talk
              </motion.a>
              <motion.a
                href="#projects"
                className="w-full rounded-full border border-white/[0.1] px-6 py-2.5 text-center text-sm font-semibold text-zinc-300 xs:w-auto"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
                whileHover={{ borderColor: "rgba(255,255,255,0.2)", color: "#f4f4f5" }}
                transition={{ duration: 0.2 }}
              >
                See Work
              </motion.a>
            </div>
          </motion.div>

        </div>
      </FadeIn>
    </section>
  );
}
