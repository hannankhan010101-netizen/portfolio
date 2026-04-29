"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { PortfolioProject } from "@/types/project.types";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";
import { type ReactNode, useState, useEffect } from "react";

interface ArchitectureModalProps {
  readonly project: PortfolioProject | null;
  readonly onClose: () => void;
}

function renderMarkdownLine(line: string, index: number): ReactNode {
  if (line.startsWith("## ")) {
    return (
      <h3
        key={index}
        className="mt-6 mb-2 text-base font-semibold text-zinc-100 first:mt-0"
      >
        {line.slice(3)}
      </h3>
    );
  }
  if (line.startsWith("### ")) {
    return (
      <h4
        key={index}
        className="mt-4 mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400"
      >
        {line.slice(4)}
      </h4>
    );
  }
  if (line.startsWith("- ")) {
    const parts = line.slice(2).split(/(\*\*[^*]+\*\*)/);
    return (
      <div key={index} className="flex gap-2.5 py-0.5">
        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/65" />
        <p className="text-sm leading-relaxed text-zinc-400">
          {parts.map((part, j) =>
            /^\*\*.+\*\*$/.test(part) ? (
              <strong key={j} className="font-semibold text-zinc-200">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            ),
          )}
        </p>
      </div>
    );
  }
  if (line === "") return <div key={index} className="h-2" />;
  return (
    <p key={index} className="text-sm leading-relaxed text-zinc-500">
      {line}
    </p>
  );
}

export function ArchitectureModal({ project, onClose }: ArchitectureModalProps) {
  const [isEli5Mode, setIsEli5Mode] = useState(false);
  const [eli5Content, setEli5Content] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset state when project changes
  useEffect(() => {
    setIsEli5Mode(false);
    setEli5Content(null);
    setIsGenerating(false);
  }, [project]);

  const handleToggleEli5 = async () => {
    if (!project) return;
    
    if (isEli5Mode) {
      setIsEli5Mode(false);
      return;
    }

    setIsEli5Mode(true);

    if (eli5Content) return; // Already generated

    setIsGenerating(true);
    try {
      const res = await fetch("/api/eli5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          markdown: project.architectureMarkdown,
          projectName: project.name
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setEli5Content(data.message);
      } else {
        setEli5Content("Failed to generate simplified architecture.");
      }
    } catch (error) {
      setEli5Content("Error generating AI response.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {project ? (
        <motion.div
          key={project.id}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ background: "rgba(0,0,0,0.72)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`architecture-title-${project.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASE }}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
        >
          <motion.div
            className="relative max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/70 flex flex-col"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: MOTION_DURATION.medium, ease: MOTION_EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal top accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/[0.07] blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between gap-4 border-b border-white/[0.08] px-6 py-5 shrink-0">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-2.5 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                    Architecture
                  </p>
                </div>
                <h2
                  id={`architecture-title-${project.id}`}
                  className="mt-2.5 text-xl font-semibold text-zinc-50"
                >
                  {project.name}
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleEli5}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200 border ${
                    isEli5Mode 
                      ? "border-violet-400/50 bg-violet-400/[0.12] text-violet-300" 
                      : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-violet-400/30 hover:text-violet-300"
                  }`}
                >
                  <span className="text-[14px]">✦</span>
                  {isEli5Mode ? "Show Technical Details" : "AI Simplify (ELI5)"}
                </button>

                <motion.button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-3.5 w-3.5"
                    aria-hidden
                  >
                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-5 flex-1" style={{ maxHeight: "calc(88vh - 100px)" }}>
              <AnimatePresence mode="wait">
                {isEli5Mode ? (
                  <motion.div
                    key="eli5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-violet-400/10">
                      <span className="text-violet-400">✦</span>
                      <p className="text-xs font-medium text-violet-300">AI Business Value Translation</p>
                    </div>
                    {isGenerating ? (
                      <div className="flex items-center gap-2 text-sm text-violet-400/70 animate-pulse">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Translating architecture to business value...
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {eli5Content?.split("\n").map((line, i) => renderMarkdownLine(line, i))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="technical"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-0.5"
                  >
                    {project.architectureMarkdown.split("\n").map((line, i) =>
                      renderMarkdownLine(line, i),
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
