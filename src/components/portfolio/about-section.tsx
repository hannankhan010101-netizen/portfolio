"use client";

import { SECTION_IDS } from "@/constants/section-ids";
import { SECTION_LABELS } from "@/constants/section-labels";
import { ABOUT_SPECIALIZATIONS, EDUCATION } from "@/constants/personal";
import { SectionEyebrow } from "@/components/portfolio/section-eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { RevealItem } from "@/components/motion/reveal-item";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";
import { useRef } from "react";

const SPEC_ICONS = [
  <svg key="crm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
  </svg>,
  <svg key="ai" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>,
  <svg key="link" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
  </svg>,
  <svg key="flow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>,
] as const;

const SPEC_COLORS = [
  { border: "border-cyan-400/15", bg: "bg-cyan-400/[0.06]", text: "text-cyan-400", hover: "hover:border-cyan-400/30" },
  { border: "border-violet-400/15", bg: "bg-violet-400/[0.06]", text: "text-violet-400", hover: "hover:border-violet-400/30" },
  { border: "border-emerald-400/15", bg: "bg-emerald-400/[0.06]", text: "text-emerald-400", hover: "hover:border-emerald-400/30" },
  { border: "border-amber-400/15", bg: "bg-amber-400/[0.06]", text: "text-amber-400", hover: "hover:border-amber-400/30" },
] as const;

/* Career timeline — unique to this section, not repeated elsewhere */
const TIMELINE = [
  { year: "2024", label: "Started CS degree", note: "Superior University, Lahore", active: false },
  { year: "Jun '25", label: "Backend Intern", note: "Befer AI booking engine", active: false },
  { year: "Aug '25", label: "Software Engineer II", note: "Promoted to full-time", active: false },
  { year: "Now", label: "Open to Opportunities", note: "Freelance · Full-time · Consulting", active: true },
] as const;

function AnimatedBar({ label, value, index }: { label: string; value: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-cyan-400">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800" style={{ backgroundColor: "var(--bar-track, #27272a)" }}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: inView ? `${value}%` : 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.08 }}
        />
      </div>
    </div>
  );
}

export function AboutSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id={SECTION_IDS.ABOUT}
      className="relative border-b border-white/10 bg-zinc-950 py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_100%_0%,rgba(52,211,153,0.055),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_0%_100%,rgba(34,211,238,0.04),transparent_55%)]" />

      <FadeIn>
        <div className="relative mx-auto max-w-6xl space-y-16 px-4 sm:px-6">

          {/* Header */}
          <div className="space-y-3">
            <SectionEyebrow>{SECTION_LABELS.ABOUT}</SectionEyebrow>
            <motion.h2
              className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE }}
            >
              At a Glance
            </motion.h2>
          </div>

          {/* Identity + Career Timeline — 2-column split */}
          <div className="grid gap-8 lg:grid-cols-2">

            {/* Left: Identity card */}
            <RevealItem as="div" hoverLift={false} delay={0.04}
              className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-6"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <div className="glow-pulse flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 text-xl font-bold text-cyan-300">
                    HA
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-zinc-950 bg-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-zinc-950" />
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-50">Hannan Ahmed Khan</h3>
                  <p className="text-sm text-cyan-400">Software Engineer II</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-zinc-400">📍 Lahore, PK</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-zinc-400">🎓 {EDUCATION.degree}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-2.5 py-0.5 text-[10px] text-emerald-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Core competency bars — unique visual, not in any other section */}
              <div className="mt-6 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Core Competencies</p>
                <AnimatedBar label="Backend Architecture" value={95} index={0} />
                <AnimatedBar label="API Design & Integration" value={92} index={1} />
                <AnimatedBar label="Database Engineering" value={88} index={2} />
                <AnimatedBar label="DevOps & CI/CD" value={82} index={3} />
              </div>
            </RevealItem>

            {/* Right: Career Timeline */}
            <RevealItem as="div" hoverLift={false} delay={0.08}
              className="rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-6"
            >
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Career Arc</p>
              <div className="relative space-y-0">
                {TIMELINE.map((event, i) => (
                  <motion.div
                    key={event.year}
                    className="flex gap-4"
                    initial={prefersReducedMotion ? false : { opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: MOTION_EASE }}
                  >
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${event.active ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_16px_-4px_rgba(34,211,238,0.6)]" : "border-white/[0.1] bg-zinc-900"}`}>
                        {event.active
                          ? <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                          : <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                        }
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div className="w-px flex-1 my-1 bg-gradient-to-b from-white/[0.08] to-transparent" style={{ minHeight: "1.5rem" }} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${event.active ? "text-cyan-400" : "text-zinc-500"}`}>{event.year}</span>
                      <p className={`text-sm font-semibold ${event.active ? "text-zinc-100" : "text-zinc-300"}`}>{event.label}</p>
                      <p className="text-xs text-zinc-500">{event.note}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </RevealItem>
          </div>

          {/* Specializations — icon-first cards, 2x2 */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Backend Specializations</p>
              <span className="h-px flex-1 bg-gradient-to-r from-white/[0.07] to-transparent" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {ABOUT_SPECIALIZATIONS.map((item, index) => {
                const color = SPEC_COLORS[index % SPEC_COLORS.length];
                return (
                  <motion.article
                    key={item.id}
                    className={`group relative overflow-hidden rounded-2xl border ${color.border} bg-zinc-900/40 p-5 transition-all duration-300 ${color.hover} hover:bg-zinc-900/70`}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: MOTION_DURATION.medium, ease: MOTION_EASE, delay: index * 0.07 }}
                    whileHover={prefersReducedMotion ? undefined : { y: -3 }}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${color.border} ${color.bg} ${color.text}`}>
                        {SPEC_ICONS[index]}
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${color.text}`}>{item.title}</h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{item.description}</p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          {/* Unique bottom element: a quote + links strip (not a CTA bridge card) */}
          <div className="flex flex-col items-center gap-4 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <blockquote className="max-w-xl font-mono text-sm italic text-zinc-500">
              "Ship fast. Break nothing. Architect for the next team, not just the next sprint."
            </blockquote>
            <div className="flex shrink-0 items-center gap-3">
              <motion.a
                href={`#${SECTION_IDS.PROJECTS}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-5 py-2 text-xs font-bold text-zinc-950 shadow-[0_0_28px_-6px_rgba(34,211,238,0.5)]"
                whileHover={{ scale: 1.03, boxShadow: "0 0 36px -4px rgba(34,211,238,0.65)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
              >
                View Projects →
              </motion.a>
            </div>
          </div>

        </div>
      </FadeIn>
    </section>
  );
}
