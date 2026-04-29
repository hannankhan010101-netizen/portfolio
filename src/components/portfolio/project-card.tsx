"use client";

import { motion, useInView, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import type { PortfolioProject } from "@/types/project.types";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";

interface ProjectCardProps {
  readonly project: PortfolioProject;
  readonly onOpenArchitecture: (project: PortfolioProject) => void;
  readonly index?: number;
}

const CARD_GRADIENTS = [
  "from-cyan-500/20 via-cyan-400/5 to-transparent",
  "from-violet-500/20 via-violet-400/5 to-transparent",
  "from-emerald-500/20 via-emerald-400/5 to-transparent",
  "from-amber-500/20 via-amber-400/5 to-transparent",
  "from-rose-500/20 via-rose-400/5 to-transparent",
] as const;

const CARD_ACCENTS = [
  { border: "rgba(34,211,238,0.35)", dot: "bg-cyan-400", dotGlow: "shadow-[0_0_8px_rgba(34,211,238,0.9)]", text: "text-cyan-400", badge: "border-cyan-400/20 bg-cyan-400/[0.06]", chip: "border-cyan-400/15 bg-cyan-400/[0.04] text-cyan-300" },
  { border: "rgba(167,139,250,0.35)", dot: "bg-violet-400", dotGlow: "shadow-[0_0_8px_rgba(167,139,250,0.9)]", text: "text-violet-400", badge: "border-violet-400/20 bg-violet-400/[0.06]", chip: "border-violet-400/15 bg-violet-400/[0.04] text-violet-300" },
  { border: "rgba(52,211,153,0.35)", dot: "bg-emerald-400", dotGlow: "shadow-[0_0_8px_rgba(52,211,153,0.9)]", text: "text-emerald-400", badge: "border-emerald-400/20 bg-emerald-400/[0.06]", chip: "border-emerald-400/15 bg-emerald-400/[0.04] text-emerald-300" },
  { border: "rgba(251,191,36,0.35)", dot: "bg-amber-400", dotGlow: "shadow-[0_0_8px_rgba(251,191,36,0.9)]", text: "text-amber-400", badge: "border-amber-400/20 bg-amber-400/[0.06]", chip: "border-amber-400/15 bg-amber-400/[0.04] text-amber-300" },
  { border: "rgba(251,113,133,0.35)", dot: "bg-rose-400", dotGlow: "shadow-[0_0_8px_rgba(251,113,133,0.9)]", text: "text-rose-400", badge: "border-rose-400/20 bg-rose-400/[0.06]", chip: "border-rose-400/15 bg-rose-400/[0.04] text-rose-300" },
] as const;

export function ProjectCard({ project, onOpenArchitecture, index = 0 }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: "some", margin: "0px 0px 12% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const delay = index * 0.07;
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  /* 3D tilt — mouse-tracking spring */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.article
      ref={cardRef}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 shadow-lg shadow-black/30"
      style={prefersReducedMotion ? undefined : {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
      animate={prefersReducedMotion ? undefined : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE, delay }}
      whileHover={prefersReducedMotion ? undefined : {
        borderColor: accent.border,
        boxShadow: `0 32px 64px -32px rgba(0,0,0,0.8), 0 0 0 1px ${accent.border.replace("0.35", "0.06")} inset`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sheen effect that moves with mouse */}
      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.03), transparent 60%)`,
          }}
        />
      )}

      {/* Gradient header band */}
      <div className={`relative overflow-hidden border-b border-white/[0.07] bg-gradient-to-br ${gradient} px-6 py-5`}>
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 ${accent.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${accent.dot} ${accent.dotGlow}`} />
              <p className={`text-[10px] font-bold uppercase tracking-[0.25em] ${accent.text}`}>{project.badgeLabel}</p>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-zinc-50">{project.name}</h3>
          </div>
          <motion.button
            type="button"
            onClick={() => onOpenArchitecture(project)}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${accent.badge} ${accent.text}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            Architecture ↗
          </motion.button>
        </div>
      </div>

      {/* Demo video */}
      {project.videoUrl ? (
        <div className="overflow-hidden border-b border-white/[0.08] bg-black">
          <video src={project.videoUrl} controls muted preload="metadata" playsInline className="w-full" style={{ display: "block", maxHeight: "240px", objectFit: "cover" }}>
            Your browser does not support the video tag.
          </video>
        </div>
      ) : null}

      {/* Body */}
      <div className="flex flex-1 flex-col gap-5 p-6">
        <p className="text-sm leading-relaxed text-zinc-400">{project.summary}</p>

        {/* Key features as chips — square style (different from other sections' pills) */}
        <div>
          <h4 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Key Features</h4>
          <div className="flex flex-wrap gap-1.5">
            {project.keyFeatures.map((feature) => (
              <span key={feature} className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-400">
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Tech stack — accent-colored square chips (unique to project cards) */}
        <div>
          <h4 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <motion.span
                key={tech}
                className={`rounded-md border px-2.5 py-0.5 text-[11px] font-medium ${accent.chip}`}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-auto flex items-center justify-between border-t border-white/[0.08] pt-4">
          <div className="flex gap-4 text-sm">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-400 underline-offset-4 transition-colors hover:text-cyan-300 hover:underline">
              GitHub ↗
            </a>
            {project.liveDemoUrl ? (
              <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className={`font-medium underline-offset-4 transition-colors hover:underline ${accent.text}`}>
                {project.liveDemoLabel} ↗
              </a>
            ) : (
              <span className="text-zinc-700">{project.liveDemoLabel}</span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
