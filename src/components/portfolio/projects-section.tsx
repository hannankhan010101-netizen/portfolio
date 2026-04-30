"use client";

import { motion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";
import { useMemo, useState } from "react";
import {
  PROJECT_CATEGORY_FILTER_KEYS,
  type ProjectCategoryFilterKey,
} from "@/constants/project-categories";
import {
  PORTFOLIO_PROJECTS,
  PROJECT_FILTER_OPTIONS,
  PROJECTS_SECTION_INTRO,
} from "@/constants/projects";
import { SECTION_IDS } from "@/constants/section-ids";
import { SECTION_LABELS } from "@/constants/section-labels";
import { SYSTEM_ARCHITECTURE_PILLARS } from "@/constants/personal";
import type { PortfolioProject } from "@/types/project.types";
import { ArchitectureModal } from "@/components/portfolio/architecture-modal";
import { ProjectCard } from "@/components/portfolio/project-card";
import { SectionEyebrow } from "@/components/portfolio/section-eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { RevealItem } from "@/components/motion/reveal-item";

/**
 * Filterable project grid with architecture modal.
 */
export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategoryFilterKey>(
    PROJECT_CATEGORY_FILTER_KEYS.ALL,
  );
  const [architectureProject, setArchitectureProject] =
    useState<PortfolioProject | null>(null);

  const visibleProjects = useMemo(() => {
    if (activeFilter === PROJECT_CATEGORY_FILTER_KEYS.ALL) {
      return PORTFOLIO_PROJECTS;
    }

    return PORTFOLIO_PROJECTS.filter((project) =>
      project.filterKeys.includes(activeFilter),
    );
  }, [activeFilter]);

  return (
    <>
      <section
        id={SECTION_IDS.PROJECTS}
        className="border-b border-white/10 bg-zinc-950 py-20 sm:py-24"
      >
        <FadeIn>
        <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
          <div className="space-y-4">
            <SectionEyebrow>{SECTION_LABELS.PORTFOLIO}</SectionEyebrow>
            <motion.h2
              className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
              initial={{ opacity: 0.9, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: "some" }}
              transition={{ duration: MOTION_DURATION.medium, ease: MOTION_EASE }}
            >
              Platform Engineering
            </motion.h2>
            <p className="max-w-3xl text-base leading-relaxed text-zinc-400">
              {PROJECTS_SECTION_INTRO}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROJECT_FILTER_OPTIONS.map((option) => {
              const isActive = option.key === activeFilter;

              return (
                <motion.button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    setActiveFilter(option.key);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-zinc-950 shadow-[0_0_24px_-6px_rgba(34,211,238,0.55)]"
                      : "border border-white/10 bg-zinc-900 text-zinc-300 hover:border-cyan-400/40"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: MOTION_EASE }}
                >
                  {option.label}
                </motion.button>
              );
            })}
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {visibleProjects.map((project, projectIndex) => {
              const isLastOdd = visibleProjects.length % 2 !== 0 && projectIndex === visibleProjects.length - 1;
              return (
                <div 
                  key={project.id} 
                  className={isLastOdd ? "flex justify-center lg:col-span-2" : ""}
                >
                  <div className={isLastOdd ? "w-full lg:max-w-[calc(50%-1rem)]" : "w-full"}>
                    <ProjectCard
                      index={projectIndex}
                      project={project}
                      onOpenArchitecture={setArchitectureProject}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {SYSTEM_ARCHITECTURE_PILLARS.map((pillar, pillarIndex) => {
              const icons = [
                // Scalability
                <svg key="scale" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M1 2.75A.75.75 0 0 1 1.75 2h16.5a.75.75 0 0 1 0 1.5H18v8.75A2.75 2.75 0 0 1 15.25 15h-1.072l.798 3.06a.75.75 0 0 1-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 0 1-1.452-.38L5.823 15H4.75A2.75 2.75 0 0 1 2 12.25V3.5h-.25A.75.75 0 0 1 1 2.75ZM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373ZM13.25 5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 .75-.75Zm-6.5 4a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 6.75 9Zm3.25-1.75a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5Z" clipRule="evenodd" /></svg>,
                // Security
                <svg key="sec" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.749Zm4.196 5.954a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>,
                // Performance
                <svg key="perf" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.061l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042-.815a.75.75 0 0 1-.53-.918Z" clipRule="evenodd" /></svg>,
              ];
              const colors = [
                { icon: "text-cyan-400", border: "border-cyan-400/15", bg: "bg-cyan-400/[0.06]", hover: "hover:border-cyan-400/25" },
                { icon: "text-emerald-400", border: "border-emerald-400/15", bg: "bg-emerald-400/[0.06]", hover: "hover:border-emerald-400/25" },
                { icon: "text-violet-400", border: "border-violet-400/15", bg: "bg-violet-400/[0.06]", hover: "hover:border-violet-400/25" },
              ];
              const c = colors[pillarIndex % colors.length];

              return (
                <RevealItem
                  key={pillar.id}
                  as="div"
                  className={`group relative overflow-hidden rounded-2xl border ${c.border} bg-zinc-900/50 p-6 transition-all duration-300 ${c.hover} hover:bg-zinc-900/70`}
                  delay={pillarIndex * 0.08}
                >
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${c.border} ${c.bg} ${c.icon}`}>
                    {icons[pillarIndex]}
                  </div>
                  <h3 className="text-base font-semibold text-zinc-50">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{pillar.description}</p>
                </RevealItem>
              );
            })}
          </div>

          {/* Conversion CTA — after proof of work, this is the highest-intent moment */}
          <RevealItem
            as="div"
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-zinc-900/80 to-zinc-950/60 p-8 text-center"
            delay={0.08}
            hoverLift={false}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(34,211,238,0.07),transparent_65%)]" />
            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-600">Have a project in mind?</p>
              <h3 className="mt-2 text-2xl font-semibold text-zinc-50 sm:text-3xl">
                Let&apos;s build something that ships.
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
                Every system above started as a requirement doc and a deadline. Reach out and I&apos;ll have a proposal back to you within 48 hours.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <motion.a
                  href={`#${SECTION_IDS.CONTACT}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-7 py-3 text-sm font-bold text-zinc-950 shadow-[0_0_36px_-8px_rgba(34,211,238,0.6)]"
                  whileHover={{ scale: 1.03, boxShadow: "0 0 48px -6px rgba(34,211,238,0.7)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                >
                  Start a Conversation
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                    <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L9.22 5.03a.75.75 0 0 1 1.06-1.06l3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5a.75.75 0 1 1-1.06-1.06l2.22-2.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                  </svg>
                </motion.a>
                <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  Responds within 24 hours
                </span>
              </div>
            </div>
          </RevealItem>

        </div>
        </FadeIn>
      </section>
      <ArchitectureModal
        project={architectureProject}
        onClose={() => {
          setArchitectureProject(null);
        }}
      />
    </>
  );
}
