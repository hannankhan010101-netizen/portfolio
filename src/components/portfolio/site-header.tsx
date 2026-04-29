"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { PRIMARY_NAV_LINKS } from "@/constants/navigation";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";
import { PERSON_FULL_NAME } from "@/constants/personal";
import { ThemeToggle } from "@/components/portfolio/theme-toggle";
import { ScrollProgress } from "@/components/portfolio/scroll-progress";

export function SiteHeader() {
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <ScrollProgress />
      <motion.header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-zinc-950/90 shadow-xl shadow-black/25 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-zinc-950/30 backdrop-blur-sm"
        }`}
        initial={prefersReducedMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: MOTION_DURATION.medium, ease: MOTION_EASE }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="flex items-center gap-2.5"
            whileHover={{ opacity: 0.85 }}
            transition={{ duration: 0.18 }}
          >
            <motion.span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-[11px] font-black text-zinc-950"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 440, damping: 22 }}
              style={{ boxShadow: "0 0 16px -4px rgba(34,211,238,0.65)" }}
            >
              HA
            </motion.span>
            <span className="header-name-gradient bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-sm font-semibold tracking-tight text-transparent">
              {PERSON_FULL_NAME}
            </span>
          </motion.a>

          {/* Nav */}
          <nav className="hidden flex-wrap items-center justify-end gap-5 text-sm text-zinc-400 md:flex">
            {PRIMARY_NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="group relative transition-colors duration-200 hover:text-zinc-100"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-cyan-400/90 to-emerald-400/70 transition-[width] duration-300 ease-out group-hover:w-full" />
              </a>
            ))}

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Hire Me CTA */}
            <motion.a
              href="#contact"
              className="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-1.5 text-xs font-bold text-zinc-950"
              whileHover={{ scale: 1.05, boxShadow: "0 0 24px -4px rgba(34,211,238,0.65)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              onClick={() => { fetch("/api/hire", { method: "POST" }).catch(() => {}); }}
            >
              Hire Me
            </motion.a>
          </nav>

          {/* Mobile: theme toggle only */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </motion.header>
    </>
  );
}
