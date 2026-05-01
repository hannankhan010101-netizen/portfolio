"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function MobileHireCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = 400;
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 md:hidden"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        >
          {/* Gradient fade above the bar */}
          <div className="pointer-events-none h-10 bg-gradient-to-t from-zinc-950/80 to-transparent" />
          <div
            className="mobile-hire-cta-bar flex items-center gap-3 border-t border-white/[0.08] bg-zinc-950/95 px-4 py-3 backdrop-blur-xl"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <a
              href="#contact"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 text-sm font-bold text-zinc-950 shadow-[0_0_24px_-6px_rgba(34,211,238,0.55)] active:scale-[0.97]"
            >
              Hire Me →
            </a>
            <a
              href="#projects"
              className="flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-300 active:scale-[0.97]"
            >
              Work
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
