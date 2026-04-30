"use client";

import { SECTION_IDS } from "@/constants/section-ids";
import { CONTACT_SECTION } from "@/constants/contact";
import { CONTACT_LINKS, PERSON_FULL_NAME } from "@/constants/personal";
import { ContactForm } from "@/components/portfolio/contact-form";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionEyebrow } from "@/components/portfolio/section-eyebrow";
import { motion, useReducedMotion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";
import { useState } from "react";

/* ── Contact items with icons ──────────────────────────────────────── */
const CONTACT_ITEMS = [
  {
    label: "Email",
    value: CONTACT_LINKS.email,
    href: `mailto:${CONTACT_LINKS.email}`,
    external: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
        <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
      </svg>
    ),
    color: "cyan",
  },
  {
    label: "Phone",
    value: CONTACT_LINKS.phoneDisplay,
    href: `tel:${CONTACT_LINKS.phoneTel}`,
    external: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 16.352V17.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
      </svg>
    ),
    color: "emerald",
  },
  {
    label: "LinkedIn",
    value: CONTACT_LINKS.linkedInDisplay,
    href: CONTACT_LINKS.linkedInUrl,
    external: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
      </svg>
    ),
    color: "violet",
  },
  {
    label: "GitHub",
    value: CONTACT_LINKS.gitHubDisplay,
    href: CONTACT_LINKS.gitHubUrl,
    external: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
      </svg>
    ),
    color: "zinc",
  },
] as const;

const COLOR_MAP: Record<string, { icon: string; ring: string; bg: string }> = {
  cyan:    { icon: "text-cyan-400",    ring: "ring-cyan-400/20",    bg: "bg-cyan-400/[0.07]"    },
  emerald: { icon: "text-emerald-400", ring: "ring-emerald-400/20", bg: "bg-emerald-400/[0.07]" },
  violet:  { icon: "text-violet-400",  ring: "ring-violet-400/20",  bg: "bg-violet-400/[0.07]"  },
  zinc:    { icon: "text-zinc-300",    ring: "ring-white/10",       bg: "bg-white/[0.05]"       },
};

/* ── Copy button ───────────────────────────────────────────────────── */
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-2 shrink-0 rounded-md p-1 text-zinc-600 transition-colors hover:text-zinc-300"
      aria-label="Copy"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-emerald-400">
          <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
          <path fillRule="evenodd" d="M11.986 3H12a2 2 0 0 1 2 2v6a2 2 0 0 1-1.5 1.937V7A2.5 2.5 0 0 0 10 4.5H4.063A2 2 0 0 1 6 3h.014A2.25 2.25 0 0 1 8.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM10.5 4v-.175a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z" clipRule="evenodd" />
          <path d="M3 6a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3Z" />
        </svg>
      )}
    </button>
  );
}

/* ── Process steps ─────────────────────────────────────────────────── */
const STEPS = [
  { n: "01", title: "Send a message", body: "Fill the form or reach out directly. No lengthy brief needed.", icon: "✉" },
  { n: "02", title: "Discovery call",  body: "15–20 min call, no sales pitch. Just scope, stack, and timeline.", icon: "📞" },
  { n: "03", title: "Proposal 48 hrs", body: "Clear scope, timeline, and pricing. We move when you're ready.", icon: "⚡" },
] as const;

/* ═══════════════════════════════════════════════════════════════════ */
export function ContactSection() {
  const prefersReduced = useReducedMotion();
  const mailtoGeneral  = `mailto:${CONTACT_LINKS.email}?subject=${encodeURIComponent("Let's Work Together")}`;

  return (
    <section id={SECTION_IDS.CONTACT} className="relative overflow-hidden bg-zinc-950 py-20 sm:py-28 lg:py-32">

      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/[0.06] blur-[100px]" />
        <div className="absolute left-0 top-1/3 h-[300px] w-[300px] rounded-full bg-emerald-500/[0.05] blur-[90px]" />
        {/* Dot grid — uses CSS class so light mode override works */}
        <div className="contact-dot-grid dot-grid absolute inset-0 opacity-[0.35]" />
      </div>

      <FadeIn>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="mb-10 space-y-5 sm:mb-16">
            <SectionEyebrow>{CONTACT_SECTION.eyebrow}</SectionEyebrow>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <motion.h2
                className="text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-5xl"
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE }}
              >
                Let&apos;s build{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  something great
                </span>
              </motion.h2>

              <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-4 py-2 sm:self-auto">
                <span className="glow-pulse h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">Replies within 24 hours</span>
              </div>
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
              {CONTACT_SECTION.description}
            </p>
          </div>

          {/* ── Process steps ──────────────────────────────────────── */}
          <div className="mb-8 grid gap-3 sm:mb-12 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-5 transition-colors hover:border-cyan-400/20"
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: MOTION_EASE }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] text-sm">
                    {s.icon}
                  </span>
                  <span className="font-mono text-[11px] font-black tracking-[0.15em] text-zinc-700">{s.n}</span>
                </div>
                <p className="text-sm font-semibold text-zinc-100">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{s.body}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Main grid ──────────────────────────────────────────── */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">

            {/* ── Form card ──────────────────────────────────────── */}
            <motion.div
              className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-zinc-900/60 p-5 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-7"
              initial={prefersReduced ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE }}
            >
              {/* Top gradient line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-cyan-400">
                    <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                    <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-50">Send me a message</h3>
                  <p className="text-xs text-zinc-500">I read every message personally</p>
                </div>
              </div>

              <ContactForm />
            </motion.div>

            {/* ── Right sidebar ──────────────────────────────────── */}
            <motion.div
              className="flex flex-col gap-6"
              initial={prefersReduced ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE, delay: 0.1 }}
            >

              {/* Contact info card */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-zinc-900/60 p-6 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
                  Direct contact
                </p>
                <div className="space-y-3">
                  {CONTACT_ITEMS.map((item) => {
                    const c = COLOR_MAP[item.color];
                    return (
                      <div
                        key={item.label}
                        className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${c.bg} ${c.ring} ${c.icon}`}>
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">{item.label}</p>
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            className={`block truncate text-sm font-medium transition-colors hover:opacity-80 ${c.icon}`}
                          >
                            {item.value}
                          </a>
                        </div>
                        <CopyButton value={item.value} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Availability card */}
              <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/[0.08] via-zinc-900/80 to-zinc-900/60 p-6 backdrop-blur-sm">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

                <div className="relative mb-3 flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                  </span>
                  <h3 className="text-sm font-bold text-zinc-50">Open to Opportunities</h3>
                </div>

                <p className="relative text-sm leading-relaxed text-zinc-400">
                  {CONTACT_SECTION.openToDescription}
                </p>

                <div className="relative mt-4 flex flex-wrap gap-2">
                  {["Freelance", "Full-time", "Consulting"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1 text-[11px] font-semibold text-emerald-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.a
                  href={mailtoGeneral}
                  className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-[0_0_28px_-6px_rgba(52,211,153,0.7)] transition-shadow hover:shadow-[0_0_36px_-4px_rgba(52,211,153,0.85)]"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  Get in touch
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L9.22 5.03a.75.75 0 0 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 1 1-1.06-1.06l2.22-2.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                  </svg>
                </motion.a>
              </div>

              {/* Timezone / location card */}
              <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-sm">🌍</div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">Location</p>
                      <p className="text-sm font-medium text-zinc-300">Lahore, Pakistan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">Timezone</p>
                    <p className="text-sm font-medium text-zinc-300">PKT · UTC+5</p>
                  </div>
                </div>
                <div className="mt-3 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                <p className="mt-3 text-xs text-zinc-600">Open to remote work worldwide. Overlap-friendly for EU &amp; US timezones.</p>
              </div>
            </motion.div>
          </div>

          {/* ── Footer ─────────────────────────────────────────────── */}
          <motion.div
            className="mt-16 flex flex-col items-center gap-4 border-t border-white/[0.06] pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: MOTION_DURATION.medium, ease: MOTION_EASE }}
          >
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
              {["SaaS", "FinTech", "PropTech", "HealthTech", "E-Commerce", "Real Estate", "Insurance", "Logistics"].map((v, i, arr) => (
                <span key={v} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-700">
                  {v}{i < arr.length - 1 && <span className="text-zinc-800">·</span>}
                </span>
              ))}
            </div>
            <p className="text-center text-xs text-zinc-700">
              © {new Date().getFullYear()} {PERSON_FULL_NAME}. Built with passion. Designed to impress.
            </p>
          </motion.div>

        </div>
      </FadeIn>
    </section>
  );
}
