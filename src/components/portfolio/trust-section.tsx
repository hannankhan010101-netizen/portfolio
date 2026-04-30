"use client";

import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { SECTION_LABELS } from "@/constants/section-labels";
import { SectionEyebrow } from "@/components/portfolio/section-eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { MOTION_EASE } from "@/constants/motion";

const CLIENT_TYPES = [
  {
    tag: "Early-Stage",
    tagColor: "border-violet-400/20 bg-violet-400/[0.06] text-violet-300",
    title: "Startups & Founders",
    description:
      "Move fast without accumulating technical debt. I build lean, scalable foundations that grow with your user base — not against it.",
    outcomes: [
      "MVP to production in weeks, not months",
      "Investor-ready architecture from day one",
      "Cost-optimised cloud infrastructure",
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 31.372 31.372 0 0 0-7.86 3.83.75.75 0 0 1-.84 0 31.508 31.508 0 0 0-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 0 1 3.305-2.033.75.75 0 0 0-.714-1.319 37 37 0 0 0-3.446 2.12A2.216 2.216 0 0 0 6 9.393v.38a31.293 31.293 0 0 0-4.28-1.746.75.75 0 0 1-.254-1.285 41.059 41.059 0 0 1 8.198-5.424ZM6 11.459a29.848 29.848 0 0 0-2.455-1.158 41.029 41.029 0 0 0-.39 3.114.75.75 0 0 0 .419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 1 0 1.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 0 1 3.095 2.348.75.75 0 0 0 .992 0 26.547 26.547 0 0 1 5.93-3.95.75.75 0 0 0 .42-.739 41.053 41.053 0 0 0-.39-3.114 29.925 29.925 0 0 0-5.199 2.801 2.25 2.25 0 0 1-2.514 0c-.41-.275-.826-.541-1.25-.797V11.46Z" clipRule="evenodd" />
      </svg>
    ),
    featured: false,
  },
  {
    tag: "Enterprise",
    tagColor: "border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300",
    title: "Enterprise Organisations",
    description:
      "Complex domain logic, compliance requirements, and multi-team coordination handled with precision. Systems that meet the bar your procurement team sets.",
    outcomes: [
      "SOC-2 ready, compliance-first architecture",
      "Multi-tenant SaaS & white-label platforms",
      "Enterprise SSO, RBAC, and audit logging",
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M4.5 2A2.5 2.5 0 0 0 2 4.5v3.879a2.5 2.5 0 0 0 .732 1.767l7.5 7.5a2.5 2.5 0 0 0 3.536 0l3.878-3.878a2.5 2.5 0 0 0 0-3.536l-7.5-7.5A2.5 2.5 0 0 0 8.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
    ),
    featured: true,
  },
  {
    tag: "Scale-Up",
    tagColor: "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300",
    title: "Scale-Up Teams",
    description:
      "Outgrowing your initial stack? I architect migrations, modernise APIs, and remove the bottlenecks holding your team back from shipping.",
    outcomes: [
      "Legacy migration without business disruption",
      "API redesign at 10× current load",
      "Platform consolidation & cost reduction",
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.061l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042-.815a.75.75 0 0 1-.53-.918Z" clipRule="evenodd" />
      </svg>
    ),
    featured: false,
  },
] as const;

const TECH_PARTNERS = [
  { name: "Stripe", category: "Payments" },
  { name: "Supabase", category: "Database" },
  { name: "OpenAI", category: "AI" },
  { name: "AWS", category: "Cloud" },
  { name: "Twilio", category: "Comms" },
  { name: "SendGrid", category: "Email" },
  { name: "QuickBooks", category: "Finance" },
  { name: "ManyChat", category: "Automation" },
  { name: "Calendly", category: "Scheduling" },
  { name: "GitHub Actions", category: "CI/CD" },
  { name: "Docker", category: "Containers" },
  { name: "Nginx", category: "Infrastructure" },
] as const;

const VERTICALS = [
  "SaaS Platforms",
  "FinTech",
  "PropTech",
  "HealthTech",
  "E-Commerce",
  "Real Estate",
  "Insurance",
  "Logistics",
  "HR & Workforce",
  "EdTech",
] as const;

function ClientCard({
  client,
  index,
}: {
  client: (typeof CLIENT_TYPES)[number];
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };
  const resetTilt = () => { mouseX.set(0.5); mouseY.set(0.5); };

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl border p-6 ${
        client.featured
          ? "border-cyan-400/20 bg-gradient-to-b from-cyan-400/[0.06] to-zinc-900/60"
          : "border-white/[0.07] bg-zinc-900/50"
      }`}
      style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: MOTION_EASE, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      {/* Glow on featured */}
      {client.featured && (
        <div className="pointer-events-none absolute -top-8 left-1/2 h-24 w-48 -translate-x-1/2 rounded-full bg-cyan-400/[0.08] blur-2xl" />
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
          client.featured
            ? "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-400"
            : "border-white/[0.08] bg-white/[0.03] text-zinc-400"
        }`}>
          {client.icon}
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${client.tagColor}`}>
          {client.tag}
        </span>
      </div>

      <h3 className="text-base font-semibold tracking-tight text-zinc-50">{client.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{client.description}</p>

      {/* Outcomes */}
      <ul className="mt-4 space-y-2">
        {client.outcomes.map((o) => (
          <li key={o} className="flex items-start gap-2">
            <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
            </svg>
            <span className="text-xs leading-relaxed text-zinc-400">{o}</span>
          </li>
        ))}
      </ul>

      {client.featured && (
        <motion.a
          href="#contact"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/[0.08] px-4 py-2.5 text-sm font-semibold text-cyan-300"
          style={{ borderColor: "rgba(34,211,238,0.25)", backgroundColor: "rgba(34,211,238,0.08)" }}
          whileHover={{ backgroundColor: "rgba(34,211,238,0.12)", borderColor: "rgba(34,211,238,0.35)" }}
          transition={{ duration: 0.2 }}
        >
          Start a conversation →
        </motion.a>
      )}
    </motion.div>
  );
}

export function TrustSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(34,211,238,0.04),transparent_60%)]" />

      <FadeIn>
        <div className="relative mx-auto max-w-6xl space-y-16 px-4 sm:px-6">

          {/* ── Who I Work With ── */}
          <div>
            <div className="mb-10 space-y-3">
              <SectionEyebrow>{SECTION_LABELS.TRUST}</SectionEyebrow>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                Trusted Across Every Stage
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-zinc-400">
                Whether you&apos;re pre-seed or post-IPO, the standards are the same: reliable systems, clear communication, and code that earns trust.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {CLIENT_TYPES.map((client, i) => (
                <ClientCard key={client.title} client={client} index={i} />
              ))}
            </div>
          </div>

          {/* ── Tech Partnerships ── */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                Production-Tested Integrations
              </h3>
              <span className="h-px flex-1 bg-gradient-to-r from-white/[0.07] to-transparent" />
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {TECH_PARTNERS.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  className="group rounded-xl border border-white/[0.07] bg-zinc-900/50 p-3 text-center transition-colors duration-200 hover:border-white/[0.14]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <p className="text-xs font-semibold text-zinc-300 group-hover:text-zinc-100">{tech.name}</p>
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-600">{tech.category}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Industry Verticals ── */}
          <div className="rounded-2xl border border-white/[0.07] bg-zinc-900/40 px-6 py-8">
            <div className="mb-5 flex items-center gap-3">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                Industry Experience
              </h3>
              <span className="h-px flex-1 bg-gradient-to-r from-white/[0.07] to-transparent" />
            </div>
            <div className="flex flex-wrap gap-2">
              {VERTICALS.map((v, i) => (
                <motion.span
                  key={v}
                  className="rounded-full border border-white/[0.08] bg-zinc-950/60 px-3.5 py-1.5 text-xs font-semibold text-zinc-400"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.22, delay: i * 0.04 }}
                  whileHover={{ borderColor: "rgba(34,211,238,0.3)", color: "#e4e4e7" }}
                >
                  {v}
                </motion.span>
              ))}
            </div>
            <p className="mt-5 text-xs text-zinc-600">
              Every engagement is domain-specific. The first thing I study is your industry&apos;s constraints, not just your tech stack.
            </p>
          </div>

        </div>
      </FadeIn>
    </section>
  );
}
