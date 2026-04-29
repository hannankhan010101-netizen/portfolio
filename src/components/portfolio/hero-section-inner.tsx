"use client";

import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { SECTION_IDS } from "@/constants/section-ids";
import {
  HERO_CTA_HIRE,
  HERO_CTA_VIEW_PROJECTS,
  HERO_GREETING,
  HERO_SCROLL_HINT,
  HERO_TECH_STRIP,
} from "@/constants/hero";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";
import {
  HERO_INTRO_PARAGRAPH,
  PERSON_FULL_NAME,
  PERSON_PRIMARY_ROLE,
} from "@/constants/personal";
import { TypingHeroTitle } from "@/components/portfolio/typing-hero-title";
import { LiveTerminal } from "@/components/portfolio/live-terminal";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.085, delayChildren: 0.14 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: MOTION_DURATION.medium, ease: MOTION_EASE } },
};

/** Magnetic button — wraps children, pulls slightly toward cursor */
function MagneticButton({ children, className, href, onClick }: {
  children: React.ReactNode;
  className: string;
  href: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.22);
    y.set((e.clientY - cy) * 0.22);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

export function HeroSectionInner() {
  const prefersReducedMotion = useReducedMotion();

  /* Parallax gradient on mouse move */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const gradX = useSpring(useTransform(mouseX, [0, 1], [35, 65]), { stiffness: 60, damping: 20 });
  const gradY = useSpring(useTransform(mouseY, [0, 1], [30, 70]), { stiffness: 60, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  }

  return (
    <motion.div
      className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 lg:py-28"
      variants={container}
      initial={prefersReducedMotion ? "show" : "hidden"}
      animate="show"
      onMouseMove={handleMouseMove}
    >
      {/* Parallax gradient orb */}
      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at ${gradX.get()}% ${gradY.get()}%, rgba(34,211,238,0.08), transparent 70%)`,
          }}
        />
      )}

      <div className="inline-flex max-w-3xl flex-col gap-10">
        <motion.div className="space-y-4" variants={item}>
          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-3.5 py-1.5">
            <span className="glow-pulse h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">
              Available for Freelance &amp; Full-time
            </span>
          </div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">{HERO_GREETING}</p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            <span className="hero-name-gradient bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              {PERSON_FULL_NAME}
            </span>
          </h1>
          <TypingHeroTitle />
          <p className="text-lg text-zinc-400 sm:text-xl">{PERSON_PRIMARY_ROLE}</p>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-300">{HERO_INTRO_PARAGRAPH}</p>
        </motion.div>

        {/* CTAs with magnetic effect */}
        <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-center" variants={item}>
          <MagneticButton
            href={`#${SECTION_IDS.PROJECTS}`}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_40px_-8px_rgba(34,211,238,0.55)] ring-1 ring-white/10"
          >
            {HERO_CTA_VIEW_PROJECTS}
          </MagneticButton>
          <MagneticButton
            href={`#${SECTION_IDS.CONTACT}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-8 py-3 text-sm font-semibold text-zinc-100 backdrop-blur-sm"
          >
            {HERO_CTA_HIRE}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 opacity-70" aria-hidden>
              <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L9.22 5.03a.75.75 0 0 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 1 1-1.06-1.06l2.22-2.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
            </svg>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Tech strip — small dots separating items (different from badge-pill chips elsewhere) */}
      <motion.div className="flex flex-wrap items-center gap-3" variants={item}>
        {HERO_TECH_STRIP.map((tech, i) => (
          <span key={tech} className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
            {i > 0 && <span className="h-1 w-1 rounded-full bg-zinc-600" aria-hidden />}
            <motion.span
              className="transition-colors duration-200 hover:text-cyan-300"
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              {tech}
            </motion.span>
          </span>
        ))}
      </motion.div>

      {/* Terminal + scroll hint */}
      <motion.div
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        variants={item}
      >
        <LiveTerminal />
        <motion.a
          href={`#${SECTION_IDS.ABOUT}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-400"
          whileHover={{ color: "#22d3ee", x: 2 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <span className="inline-block h-8 w-px bg-gradient-to-b from-cyan-400/0 via-cyan-400 to-cyan-400/0" />
          {HERO_SCROLL_HINT}
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
