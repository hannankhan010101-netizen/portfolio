"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-8 w-14 items-center rounded-full border border-white/10 bg-zinc-900/80 p-1 transition-colors duration-300 theme-toggle-track"
      whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 theme-toggle-fill"
        style={{
          background: "linear-gradient(135deg, #fde68a 0%, #fbbf24 100%)",
        }}
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Thumb */}
      <motion.div
        className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-sm"
        style={{
          backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
          boxShadow: isDark
            ? "0 0 10px rgba(34,211,238,0.4)"
            : "0 1px 3px rgba(0,0,0,0.2)",
        }}
        animate={{ x: isDark ? 0 : 22 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Moon */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="absolute h-3 w-3 text-cyan-400"
          animate={{ opacity: isDark ? 1 : 0, rotate: isDark ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M14.438 10.148c.19-.425-.321-.787-.748-.601A5.5 5.5 0 0 1 6.453 2.31c.186-.427-.176-.938-.6-.748a6.501 6.501 0 1 0 8.585 8.586Z" />
        </motion.svg>

        {/* Sun */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="absolute h-3 w-3 text-amber-500"
          animate={{ opacity: isDark ? 0 : 1, rotate: isDark ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M8 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 1ZM10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM12.95 4.11a.75.75 0 1 0-1.06-1.06l-1.062 1.06a.75.75 0 0 0 1.061 1.062l1.06-1.061ZM15 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 15 8ZM11.89 12.95a.75.75 0 0 0 1.06-1.06l-1.06-1.062a.75.75 0 0 0-1.062 1.061l1.061 1.06ZM8 12a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 12ZM5.172 11.89a.75.75 0 0 0-1.061-1.062L3.05 11.89a.75.75 0 1 0 1.06 1.06l1.06-1.06ZM4 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 4 8ZM4.11 5.172A.75.75 0 0 0 5.17 4.11L4.11 3.05a.75.75 0 1 0-1.06 1.06l1.06 1.062Z" />
        </motion.svg>
      </motion.div>
    </motion.button>
  );
}
