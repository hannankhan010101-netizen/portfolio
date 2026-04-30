"use client";

import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { useRef } from "react";
import { SECTION_IDS } from "@/constants/section-ids";
import {
  HERO_CTA_HIRE,
  HERO_CTA_VIEW_PROJECTS,
  HERO_GREETING,
  HERO_SCROLL_HINT,
} from "@/constants/hero";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";
import {
  HERO_INTRO_PARAGRAPH,
  PERSON_FULL_NAME,
  PERSON_PRIMARY_ROLE,
} from "@/constants/personal";
import { TypingHeroTitle } from "@/components/portfolio/typing-hero-title";
import { LiveTerminal } from "@/components/portfolio/live-terminal";
import { TechMarquee } from "@/components/portfolio/tech-marquee";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: MOTION_DURATION.medium, ease: MOTION_EASE } },
};

const QUICK_STATS = [
  { value: "60+", label: "Service Modules" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "5+", label: "Live Products" },
  { value: "35%", label: "Faster Deploys" },
] as const;

/** Magnetic button */
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

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const gradX = useSpring(useTransform(mouseX, [0, 1], [28, 72]), { stiffness: 55, damping: 18 });
  const gradY = useSpring(useTransform(mouseY, [0, 1], [24, 68]), { stiffness: 55, damping: 18 });
  const parallaxBg  = useMotionTemplate`radial-gradient(ellipse 65% 45% at ${gradX}% ${gradY}%, rgba(34,211,238,0.09), rgba(52,211,153,0.03) 55%, transparent 75%)`;
  const spotlightBg = useMotionTemplate`radial-gradient(ellipse 80% 60% at ${gradX}% ${gradY}%, rgba(34,211,238,0.03), transparent 65%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  }

  return (
    <motion.div
      className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:gap-8 sm:px-6 sm:py-16 lg:py-24"
      variants={container}
      initial={prefersReducedMotion ? "show" : "hidden"}
      animate="show"
      onMouseMove={handleMouseMove}
    >
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-1/4 z-0 spotlight-drift"
          style={{ background: spotlightBg }}
        />
      )}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: parallaxBg }}
        />
      )}

      <div className="inline-flex max-w-3xl flex-col gap-7">
        <motion.div className="space-y-4" variants={item}>

          {/* Status + meta row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-3.5 py-1.5">
              <span className="glow-pulse h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300">
                Available for Freelance &amp; Full-time
              </span>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-500 sm:inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 text-zinc-600">
                <path fillRule="evenodd" d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 8c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .19.153l.012.01ZM8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
              </svg>
              Lahore, Pakistan
            </span>
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 sm:text-sm">{HERO_GREETING}</p>

          {/* Name */}
          <h1 className="hero-name-gradient bg-gradient-to-br from-white via-white to-zinc-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            {PERSON_FULL_NAME}
          </h1>

          <TypingHeroTitle />
          <p className="text-sm font-medium text-zinc-400 sm:text-base lg:text-lg">{PERSON_PRIMARY_ROLE}</p>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">{HERO_INTRO_PARAGRAPH}</p>
        </motion.div>

        {/* Quick stats strip */}
        <motion.div
          variants={item}
          className="grid grid-cols-2 gap-x-5 gap-y-3 border-l-2 border-cyan-400/30 pl-5 sm:flex sm:flex-wrap sm:gap-x-6"
        >
          {QUICK_STATS.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="text-lg font-bold text-cyan-400 tabular-nums sm:text-xl">{s.value}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 sm:text-[11px]">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" variants={item}>
          <MagneticButton
            href={`#${SECTION_IDS.PROJECTS}`}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_40px_-8px_rgba(34,211,238,0.6)] ring-1 ring-white/10 transition-shadow hover:shadow-[0_0_56px_-6px_rgba(34,211,238,0.75)] sm:px-8 sm:py-3.5"
          >
            {HERO_CTA_VIEW_PROJECTS}
          </MagneticButton>
          <MagneticButton
            href={`#${SECTION_IDS.CONTACT}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-zinc-100 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/[0.07] sm:px-8 sm:py-3.5"
          >
            {HERO_CTA_HIRE}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 opacity-70" aria-hidden>
              <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L9.22 5.03a.75.75 0 0 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 1 1-1.06-1.06l2.22-2.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
            </svg>
          </MagneticButton>

          {/* Social links */}
          <div className="flex items-center gap-2 sm:ml-1">
            <a
              href="https://github.com/hannankhan010101-netizen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
              aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Tech marquee */}
      <motion.div variants={item} className="-mx-4 sm:-mx-6">
        <TechMarquee />
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
