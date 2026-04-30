"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { PRIMARY_NAV_LINKS } from "@/constants/navigation";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";
import { PERSON_FULL_NAME } from "@/constants/personal";
import { ThemeToggle } from "@/components/portfolio/theme-toggle";
import { ScrollProgress } from "@/components/portfolio/scroll-progress";

export function SiteHeader() {
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Prevent body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = useCallback(() => setMenuOpen(false), []);

  const navLinkClass =
    "group relative py-1 transition-colors duration-200 hover:text-zinc-100";
  const underline =
    "absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-cyan-400/90 to-emerald-400/70 transition-[width] duration-300 ease-out group-hover:w-full";

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
            onClick={close}
          >
            <motion.div
              className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/10"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 440, damping: 22 }}
              style={{ boxShadow: "0 0 16px -4px rgba(34,211,238,0.5)" }}
            >
              <img
                src="/images/profile.png"
                alt={PERSON_FULL_NAME}
                className="h-full w-full object-cover"
              />
            </motion.div>
            <span className="header-name-gradient bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-sm font-semibold tracking-tight text-transparent">
              {PERSON_FULL_NAME}
            </span>
          </motion.a>

          {/* Desktop nav */}
          <nav className="hidden flex-wrap items-center justify-end gap-5 text-sm text-zinc-400 md:flex">
            {PRIMARY_NAV_LINKS.map((link) => (
              <a key={link.id} href={`#${link.id}`} className={navLinkClass}>
                {link.label}
                <span className={underline} />
              </a>
            ))}
            <ThemeToggle />
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

          {/* Mobile right side: theme toggle + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100"
            >
              <motion.span
                className="absolute block h-[1.5px] w-4.5 rounded-full bg-current"
                animate={menuOpen
                  ? { rotate: 45, y: 0, width: 18 }
                  : { rotate: 0, y: -5, width: 18 }}
                transition={{ duration: 0.22, ease: MOTION_EASE }}
              />
              <motion.span
                className="absolute block h-[1.5px] rounded-full bg-current"
                animate={menuOpen
                  ? { opacity: 0, width: 0 }
                  : { opacity: 1, width: 14 }}
                transition={{ duration: 0.18 }}
              />
              <motion.span
                className="absolute block h-[1.5px] w-4.5 rounded-full bg-current"
                animate={menuOpen
                  ? { rotate: -45, y: 0, width: 18 }
                  : { rotate: 0, y: 5, width: 18 }}
                transition={{ duration: 0.22, ease: MOTION_EASE }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-30 bg-zinc-950/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            />

            {/* Slide-down panel */}
            <motion.div
              className="mobile-menu-overlay fixed inset-x-0 top-[57px] z-30 border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl md:hidden"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: MOTION_EASE }}
            >
              <nav className="flex flex-col divide-y divide-white/[0.05] px-4 py-2 sm:px-6">
                {PRIMARY_NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={close}
                    className="flex items-center gap-3 py-4 text-base font-medium text-zinc-300 transition-colors hover:text-cyan-400"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045, duration: 0.2, ease: MOTION_EASE }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
                    {link.label}
                  </motion.a>
                ))}

                {/* Hire Me button */}
                <motion.div
                  className="py-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: PRIMARY_NAV_LINKS.length * 0.045 + 0.05, duration: 0.2 }}
                >
                  <a
                    href="#contact"
                    onClick={() => {
                      close();
                      fetch("/api/hire", { method: "POST" }).catch(() => {});
                    }}
                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950 shadow-[0_0_24px_-6px_rgba(34,211,238,0.6)]"
                  >
                    Hire Me →
                  </a>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
