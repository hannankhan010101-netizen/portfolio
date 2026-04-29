"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";
import { SITE_LOADER_MIN_MS, SITE_LOADER_SUBTITLE } from "@/constants/loader";
import { PERSON_FULL_NAME } from "@/constants/personal";

interface SiteLoaderProps {
  readonly children: ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      when: "beforeChildren" as const,
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 380,
      damping: 28,
      mass: 0.65,
    },
  },
};

/**
 * Full-viewport loader until the DOM is interactive and a short minimum time has passed.
 * Dismisses on DOMContentLoaded (faster than window "load") for a snappier first paint.
 */
export function SiteLoader({ children }: SiteLoaderProps) {
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const startedAt = Date.now();

    const complete = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, SITE_LOADER_MIN_MS - elapsed);
      window.setTimeout(() => {
        setReady(true);
      }, remaining);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", complete, { once: true });
    } else {
      complete();
    }

    return () => {
      document.removeEventListener("DOMContentLoaded", complete);
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  const exitTransition = reduceMotion
    ? { duration: MOTION_DURATION.fast, ease: MOTION_EASE as unknown as [number, number, number, number] }
    : {
        duration: MOTION_DURATION.medium,
        ease: MOTION_EASE as unknown as [number, number, number, number],
      };

  return (
    <>
      {children}
      <AnimatePresence>
        {!ready ? (
          <motion.div
            key="site-loader"
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 overflow-hidden bg-zinc-950 px-6"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: reduceMotion ? 1 : 0.985,
              y: reduceMotion ? 0 : -12,
            }}
            transition={exitTransition}
            aria-busy="true"
            aria-live="polite"
            aria-label="Loading"
          >
            <motion.div
              className="pointer-events-none absolute -left-1/4 top-1/4 h-[min(80vw,520px)] w-[min(80vw,520px)] rounded-full bg-cyan-500/15 blur-3xl"
              aria-hidden
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.08, 1],
                      opacity: [0.35, 0.55, 0.35],
                    }
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="pointer-events-none absolute -right-1/4 bottom-0 h-[min(70vw,440px)] w-[min(70vw,440px)] rounded-full bg-emerald-500/10 blur-3xl"
              aria-hidden
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scale: [1.05, 1, 1.05],
                      opacity: [0.25, 0.45, 0.25],
                    }
              }
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.12),transparent_50%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(52,211,153,0.06),transparent_45%)]" />

            <motion.div
              className="relative flex flex-col items-center gap-5 text-center"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div
                className="relative h-16 w-16"
                variants={itemVariants}
              >
                {!reduceMotion && (
                  <motion.span
                    className="absolute inset-[-20%] rounded-full border border-cyan-400/20"
                    animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.45, 0.2] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-cyan-500/20"
                  animate={reduceMotion ? false : { rotate: 360 }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.span
                  className="absolute inset-1 rounded-full border-2 border-transparent border-t-cyan-400 border-r-emerald-400/85"
                  animate={reduceMotion ? false : { rotate: -360 }}
                  transition={{
                    duration: 1.25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.span
                  className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.75)]"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          scale: [1, 1.25, 1],
                          opacity: [0.85, 1, 0.85],
                        }
                  }
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <p className="bg-gradient-to-r from-zinc-100 via-cyan-200 to-emerald-200/90 bg-clip-text text-lg font-semibold tracking-tight text-transparent sm:text-xl">
                  {PERSON_FULL_NAME}
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
                  {SITE_LOADER_SUBTITLE}
                </p>
                <motion.div
                  className="mx-auto mt-3 h-px w-24 origin-left rounded-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: reduceMotion ? 0.2 : 0.85,
                    ease: MOTION_EASE,
                    delay: 0.15,
                  }}
                />
              </motion.div>

              <motion.div
                className="flex gap-1.5"
                variants={itemVariants}
                aria-hidden
              >
                {[0, 1, 2, 3].map((dot) => (
                  <motion.span
                    key={dot}
                    className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-cyan-300 to-emerald-400"
                    animate={
                      reduceMotion
                        ? { opacity: 0.6 }
                        : {
                            opacity: [0.2, 1, 0.2],
                            y: [0, -5, 0],
                            scale: [0.9, 1, 0.9],
                          }
                    }
                    transition={{
                      duration: 0.75,
                      repeat: Infinity,
                      delay: dot * 0.12,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
