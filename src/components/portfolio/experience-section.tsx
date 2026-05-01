"use client";

import { SECTION_IDS } from "@/constants/section-ids";
import { SECTION_LABELS } from "@/constants/section-labels";
import { EXPERIENCE_ENTRIES } from "@/constants/experience";
import { SectionEyebrow } from "@/components/portfolio/section-eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";

const ENTRY_IMPACT: Record<string, { metric: string; label: string; sub: string }[]> = {
  "software-engineer-ii": [
    { metric: "99.9%", label: "Uptime", sub: "AI-driven B2B" },
    { metric: "−35%", label: "Deploy Cycles", sub: "via Docker CI/CD" },
    { metric: "4+", label: "Integrations", sub: "Stripe · Twilio · Meta" },
  ],
  "backend-intern": [
    { metric: "60+", label: "Modules Built", sub: "booking, leads, pay" },
    { metric: "3", label: "Core Systems", sub: "reminders · calendar" },
    { metric: "< 3mo", label: "Promoted", sub: "Intern → Eng II" },
  ],
};

const ENTRY_CALLOUT: Record<string, string> = {
  "software-engineer-ii":
    "Primary on-call engineer — distributed auth, real-time API integrations, and containerized deployment pipelines.",
  "backend-intern":
    "Contributed to Befer AI's high-volume booking engine and automated Google Calendar sync system.",
};

export function ExperienceSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id={SECTION_IDS.EXPERIENCE}
      className="relative overflow-hidden border-b border-white/10 bg-zinc-900 py-14 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_0%_100%,rgba(34,211,238,0.04),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_100%_10%,rgba(52,211,153,0.03),transparent_50%)]" />

      <FadeIn>
        <div className="relative mx-auto max-w-6xl space-y-12 px-4 sm:px-6">

          {/* Header — left-aligned with inline year range (unique structure) */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <SectionEyebrow>{SECTION_LABELS.EXPERIENCE}</SectionEyebrow>
              <motion.h2
                className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE }}
              >
                Work Experience
              </motion.h2>
            </div>
            <motion.div
              className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-1.5"
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: MOTION_EASE }}
            >
              <span className="glow-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300">Jun 2025 – Present</span>
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            {EXPERIENCE_ENTRIES.map((entry, index) => {
              const impacts = ENTRY_IMPACT[entry.id] ?? [];
              const callout = ENTRY_CALLOUT[entry.id];

              return (
                <motion.article
                  key={entry.id}
                  className="flex gap-5 sm:gap-7"
                  initial={prefersReducedMotion ? false : { opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: MOTION_EASE, delay: index * 0.07 }}
                >
                  {/* Timeline dot + connector */}
                  <div className="hidden flex-col items-center sm:flex">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/25 bg-zinc-950 shadow-[0_0_20px_-4px_rgba(34,211,238,0.3)]">
                      <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
                    </div>
                    {index < EXPERIENCE_ENTRIES.length - 1 && (
                      <div className="mt-2 w-px flex-1 bg-gradient-to-b from-cyan-400/25 via-white/[0.06] to-transparent" style={{ minHeight: "2rem" }} />
                    )}
                  </div>

                  {/* Card */}
                  <motion.div
                    className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 shadow-lg shadow-black/20"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    whileHover={prefersReducedMotion ? undefined : { y: -3, borderColor: "rgba(34,211,238,0.15)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    {/* Card header */}
                    <div className="flex flex-col gap-2 border-b border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-50">{entry.title}</h3>
                        <p className="mt-0.5 text-sm font-medium text-cyan-300">{entry.company}</p>
                      </div>
                      <span className="inline-block shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-500">
                        {entry.dateRange}
                      </span>
                    </div>

                    {/* Impact strip — large gradient numbers, visual focus */}
                    {impacts.length > 0 && (
                      <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
                        {impacts.map((imp) => (
                          <div key={imp.label} className="flex flex-col items-center px-2 py-3 text-center sm:px-4 sm:py-4">
                            <p className="stat-gradient-text text-lg font-bold tabular-nums sm:text-2xl">{imp.metric}</p>
                            <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 sm:text-[10px]">{imp.label}</p>
                            <p className="mt-0.5 hidden text-[10px] leading-snug text-zinc-600 sm:block">{imp.sub}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Key callout */}
                    {callout && (
                      <div className="border-b border-white/[0.06] px-6 py-4">
                        <p className="text-sm leading-relaxed text-zinc-300">{callout}</p>
                      </div>
                    )}

                    {/* Technologies — dot-separated inline list (NOT pill chips) */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-6 py-4">
                      {entry.technologies.map((tech, i) => (
                        <span key={tech} className="flex items-center gap-3 text-xs text-zinc-500">
                          {i > 0 && <span className="h-1 w-1 rounded-full bg-zinc-700" aria-hidden />}
                          <span className="font-medium text-zinc-400">{tech}</span>
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.article>
              );
            })}
          </div>

          {/* Philosophy — styled quote, no generic CTA card */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-dashed border-white/[0.12] bg-zinc-950/40 p-8"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: MOTION_EASE }}
          >
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-cyan-400/0 via-cyan-400/60 to-cyan-400/0" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-1 rounded-r-2xl bg-gradient-to-b from-emerald-400/0 via-emerald-400/40 to-emerald-400/0" />
            <p className="text-center font-mono text-sm italic leading-relaxed text-zinc-300 sm:text-base">
              "I build backend systems the way enterprise infrastructure demands: reliable, maintainable, and architected to scale."
            </p>
          </motion.div>

          {/* Unique CTA — full-width banner, not a card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-emerald-500/5 to-transparent p-8 text-center">
            <div className="pointer-events-none absolute inset-0 dot-grid opacity-25" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Ready to collaborate?</p>
              <h3 className="mt-2 text-xl font-semibold text-zinc-50 sm:text-2xl">Let&apos;s add another win to this timeline.</h3>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
                <motion.a
                  href={`#${SECTION_IDS.CONTACT}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-7 py-2.5 text-sm font-bold text-zinc-950 shadow-[0_0_36px_-8px_rgba(34,211,238,0.6)]"
                  whileHover={{ scale: 1.04, boxShadow: "0 0 48px -6px rgba(34,211,238,0.7)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                >
                  Hire Me →
                </motion.a>
                <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  Responds within 24 hours
                </span>
              </div>
            </div>
          </div>

        </div>
      </FadeIn>
    </section>
  );
}
