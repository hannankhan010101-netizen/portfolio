"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import { SECTION_IDS } from "@/constants/section-ids";
import { SECTION_LABELS } from "@/constants/section-labels";
import { SKILL_BAR_GROUPS, SKILL_EXPERTISE_CARDS } from "@/constants/skills";
import { SectionEyebrow } from "@/components/portfolio/section-eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { SkillsThreeBackground } from "@/components/portfolio/skills-three-background";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";
import { TechMarquee } from "@/components/portfolio/tech-marquee";

const EXPERTISE_ICONS = [
  <svg key="api" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v11.5A2.25 2.25 0 0 0 4.25 18h11.5A2.25 2.25 0 0 0 18 15.75V4.25A2.25 2.25 0 0 0 15.75 2H4.25Zm4.03 6.28a.75.75 0 0 0-1.06-1.06L4.97 9.47a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 0 0 1.06-1.06L6.56 10l1.72-1.72Zm4.5-1.06a.75.75 0 1 0-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06l2.25-2.25a.75.75 0 0 0 0-1.06l-2.25-2.25Z" clipRule="evenodd" /></svg>,
  <svg key="db" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10 3c-4.31 0-8 1.343-8 3.5v7c0 2.157 3.69 3.5 8 3.5 4.31 0 8-1.343 8-3.5v-7C18 4.343 14.31 3 10 3Z" /></svg>,
  <svg key="auth" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>,
  <svg key="pay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M2.5 4A1.5 1.5 0 0 0 1 5.5V6h18v-.5A1.5 1.5 0 0 0 17.5 4h-15ZM19 8.5H1v6A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5v-6ZM3 13.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm4.75-.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" clipRule="evenodd" /></svg>,
  <svg key="mt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 17a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" /></svg>,
  <svg key="perf" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.061l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042-.815a.75.75 0 0 1-.53-.918Z" clipRule="evenodd" /></svg>,
];

function getProficiencyStyle(percent: number) {
  if (percent >= 90) return { dot: "bg-cyan-400", glow: "shadow-[0_0_8px_rgba(34,211,238,0.9)]", hoverBorder: "hover:border-cyan-400/35" };
  if (percent >= 80) return { dot: "bg-emerald-400", glow: "shadow-[0_0_8px_rgba(52,211,153,0.8)]", hoverBorder: "hover:border-emerald-400/35" };
  return { dot: "bg-zinc-500", glow: "", hoverBorder: "hover:border-zinc-500/35" };
}

function TechBadge({ label, percent, index }: { label: string; percent: number; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const style = getProficiencyStyle(percent);

  return (
    <motion.div
      className={`group flex flex-col items-center gap-2 rounded-xl border border-white/[0.08] bg-zinc-950/60 px-3 py-3 transition-colors duration-200 ${style.hoverBorder}`}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.22, delay: index * 0.025 }}
      whileHover={prefersReducedMotion ? undefined : { y: -4, transition: { type: "spring", stiffness: 400, damping: 18 } }}
    >
      <span className="text-center text-[11px] font-semibold leading-tight text-zinc-200">{label}</span>
      <span className={`h-[5px] w-[5px] rounded-full ${style.dot} ${style.glow}`} />
    </motion.div>
  );
}

function ExpertiseCard({ title, description, index, icon }: { title: string; description: string; index: number; icon: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const fromLeft = index % 2 === 0;

  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-950/70 p-5"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
      initial={prefersReducedMotion ? false : { opacity: 0, x: fromLeft ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE, delay: index * 0.06 }}
      whileHover={prefersReducedMotion ? undefined : { y: -4, borderColor: "rgba(34,211,238,0.2)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-400">
          {icon}
        </div>
        <span className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
      </div>
      <h4 className="text-sm font-semibold text-zinc-100">{title}</h4>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500">{description}</p>
    </motion.article>
  );
}

export function SkillsSection() {
  return (
    <section
      id={SECTION_IDS.SKILLS}
      className="relative overflow-hidden border-b border-white/10 bg-zinc-900 py-14 sm:py-20 lg:py-24"
    >
      <SkillsThreeBackground />
      <div className="three-bg-overlay pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-zinc-900/95 via-zinc-900/88 to-zinc-900/95" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(34,211,238,0.08),transparent_55%)]" />

      <FadeIn>
        <div className="relative z-10 mx-auto max-w-6xl space-y-14 px-4 sm:px-6">

          {/* Header — right-side legend instead of paragraph */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <SectionEyebrow>{SECTION_LABELS.EXPERTISE}</SectionEyebrow>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl lg:text-4xl">
                Technical Skills
              </h2>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4 rounded-xl border border-white/[0.07] bg-zinc-950/60 px-4 py-3 sm:flex-col sm:items-start sm:gap-2">
              {[
                { dot: "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]", text: "text-cyan-400", label: "Expert ≥90%" },
                { dot: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]", text: "text-emerald-400", label: "Advanced 80-89%" },
                { dot: "bg-zinc-500", text: "text-zinc-500", label: "Proficient 75-79%" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`h-[5px] w-[5px] rounded-full ${l.dot}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${l.text}`}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Infinite tech marquee strip */}
          <TechMarquee className="-mx-4 sm:-mx-6" fromBg="zinc-900" />

          {/* Tech grid by category */}
          <div className="space-y-8">
            {SKILL_BAR_GROUPS.map((group, groupIndex) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: MOTION_EASE, delay: groupIndex * 0.07 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{group.title}</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-white/[0.07] to-transparent" />
                  <span className="rounded-md border border-white/[0.07] bg-zinc-950/60 px-2 py-0.5 text-[10px] tabular-nums text-zinc-600">{group.items.length}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                  {group.items.map((item, i) => (
                    <TechBadge key={item.id} label={item.label} percent={item.percent} index={groupIndex * 10 + i} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Expertise cards — alternating slide-in directions */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Areas of Expertise</h3>
              <span className="h-px flex-1 bg-gradient-to-r from-white/[0.07] to-transparent" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SKILL_EXPERTISE_CARDS.map((card, index) => (
                <ExpertiseCard key={card.id} title={card.title} description={card.description} index={index} icon={EXPERTISE_ICONS[index % EXPERTISE_ICONS.length]} />
              ))}
            </div>
          </div>

          {/* Closing — NOT a CTA card. A visual stat strip unique to this section. */}
          <motion.div
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: MOTION_EASE }}
          >
            {[
              { n: "4", label: "Skill Categories" },
              { n: "28+", label: "Technologies" },
              { n: "6", label: "Expertise Areas" },
              { n: "100%", label: "Production-Deployed" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/[0.07] bg-zinc-950/40 p-4 text-center">
                <p className="stat-gradient-text text-2xl font-bold tabular-nums">{s.n}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{s.label}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </FadeIn>
    </section>
  );
}
