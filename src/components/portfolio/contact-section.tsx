"use client";

import { SECTION_IDS } from "@/constants/section-ids";
import { CONTACT_SECTION } from "@/constants/contact";
import { CONTACT_LINKS, PERSON_FULL_NAME } from "@/constants/personal";
import { ContactForm } from "@/components/portfolio/contact-form";
import { FadeIn } from "@/components/motion/fade-in";
import { RevealItem } from "@/components/motion/reveal-item";
import { SectionEyebrow } from "@/components/portfolio/section-eyebrow";
import { motion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";

const CONTACT_ITEMS = [
  { label: "Email", value: CONTACT_LINKS.email, href: `mailto:${CONTACT_LINKS.email}`, external: false },
  { label: "Phone", value: CONTACT_LINKS.phoneDisplay, href: `tel:${CONTACT_LINKS.phoneTel}`, external: false },
  { label: "LinkedIn", value: CONTACT_LINKS.linkedInDisplay, href: CONTACT_LINKS.linkedInUrl, external: true },
  { label: "GitHub", value: CONTACT_LINKS.gitHubDisplay, href: CONTACT_LINKS.gitHubUrl, external: true },
] as const;

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Send a message",
    description: "Fill out the form or reach out directly via email. No lengthy brief required — just tell me what you're building.",
  },
  {
    step: "02",
    title: "Free discovery call",
    description: "We schedule a 15–20 minute call to discuss your project, stack, and timeline. No commitment, no sales pitch.",
  },
  {
    step: "03",
    title: "Proposal within 48 hrs",
    description: "You receive a clear scope, timeline, and pricing. We move when you're ready.",
  },
] as const;

export function ContactSection() {
  const mailtoGeneral = `mailto:${CONTACT_LINKS.email}?subject=${encodeURIComponent("Let's Work Together")}`;

  return (
    <section id={SECTION_IDS.CONTACT} className="relative bg-zinc-950 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(34,211,238,0.055),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_0%_60%,rgba(52,211,153,0.04),transparent_50%)]" />

      <FadeIn>
        <div className="relative mx-auto max-w-6xl space-y-12 px-4 sm:px-6">

          {/* Header */}
          <div className="space-y-4">
            <SectionEyebrow>{CONTACT_SECTION.eyebrow}</SectionEyebrow>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <motion.h2
                className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
                initial={{ opacity: 0.9, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: "some" }}
                transition={{ duration: MOTION_DURATION.medium, ease: MOTION_EASE }}
              >
                {CONTACT_SECTION.title}
              </motion.h2>
              {/* Response time trust badge */}
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-1.5">
                <span className="glow-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">Responds within 24 hours</span>
              </div>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
              {CONTACT_SECTION.description}
            </p>
          </div>

          {/* What to expect */}
          <RevealItem as="div" className="grid gap-4 sm:grid-cols-3" delay={0.04} hoverLift={false}>
            {PROCESS_STEPS.map((s) => (
              <div key={s.step} className="flex gap-3 rounded-xl border border-white/[0.07] bg-zinc-900/40 p-4">
                <span className="mt-0.5 text-[11px] font-black tabular-nums tracking-[0.1em] text-cyan-400/60">{s.step}</span>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{s.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{s.description}</p>
                </div>
              </div>
            ))}
          </RevealItem>

          {/* Grid */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            {/* Form */}
            <RevealItem
              as="div"
              className="space-y-4 rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6"
              delay={0.05}
            >
              <h3 className="text-base font-semibold text-zinc-50">
                {CONTACT_SECTION.formTitle}
              </h3>
              <ContactForm />
            </RevealItem>

            {/* Info */}
            <RevealItem as="div" className="space-y-6" delay={0.1} hoverLift={false}>
              {/* Contact links */}
              <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  {CONTACT_SECTION.contactInfoTitle}
                </h3>
                <dl className="mt-5 space-y-4">
                  {CONTACT_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                      <dt className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                        {item.label}
                      </dt>
                      <dd className="text-right">
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="text-sm text-cyan-300 underline-offset-4 transition-colors hover:text-cyan-200 hover:underline"
                        >
                          {item.value}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Availability card */}
              <div className="relative overflow-hidden rounded-2xl border border-dashed border-emerald-400/20 bg-zinc-900/40 p-6">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-400/[0.06] blur-2xl" />
                <div className="mb-3 flex items-center gap-2">
                  <span className="glow-pulse h-2 w-2 rounded-full bg-emerald-400" />
                  <h3 className="text-sm font-semibold text-zinc-50">{CONTACT_SECTION.openToTitle}</h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {CONTACT_SECTION.openToDescription}
                </p>
                <motion.a
                  href={mailtoGeneral}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/[0.06] px-5 py-2 text-sm font-semibold text-emerald-300"
                  style={{ backgroundColor: "rgba(52,211,153,0.06)", borderColor: "rgba(52,211,153,0.35)" }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(52, 211, 153, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  {CONTACT_SECTION.openToCta} →
                </motion.a>
              </div>
            </RevealItem>
          </div>

          {/* Footer */}
          <motion.div
            className="border-t border-white/[0.07] pt-4 text-center text-xs text-zinc-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: MOTION_DURATION.medium, ease: MOTION_EASE }}
          >
            © {new Date().getFullYear()} {PERSON_FULL_NAME}. All rights reserved.
          </motion.div>

        </div>
      </FadeIn>
    </section>
  );
}
