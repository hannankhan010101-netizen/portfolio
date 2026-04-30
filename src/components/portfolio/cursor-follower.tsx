"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useState } from "react";

export function CursorFollower() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);
  const [clicking, setClicking] = useState(false);

  const rawX = useMotionValue(-999);
  const rawY = useMotionValue(-999);

  /* Orb — lags behind for a dreamy trail effect */
  const orbSpringX = useSpring(rawX, { stiffness: 70, damping: 20 });
  const orbSpringY = useSpring(rawY, { stiffness: 70, damping: 20 });

  /* Dot — snappy, nearly instant */
  const dotSpringX = useSpring(rawX, { stiffness: 500, damping: 32 });
  const dotSpringY = useSpring(rawY, { stiffness: 500, damping: 32 });

  const orbX = useTransform(orbSpringX, (v) => v - 180);
  const orbY = useTransform(orbSpringY, (v) => v - 180);
  const haloX = useTransform(orbSpringX, (v) => v - 16);
  const haloY = useTransform(orbSpringY, (v) => v - 16);
  const dotX = useTransform(dotSpringX, (v) => v - 5);
  const dotY = useTransform(dotSpringY, (v) => v - 5);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(coarse);
    if (coarse || prefersReducedMotion) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!document.body.classList.contains("custom-cursor")) {
        document.body.classList.add("custom-cursor");
      }
      setVisible(true);
    };
    const onLeave  = () => setVisible(false);
    const onEnter  = () => setVisible(true);
    const onDown   = () => setClicking(true);
    const onUp     = () => setClicking(false);

    document.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown",  onDown);
    document.addEventListener("mouseup",    onUp);

    return () => {
      document.body.classList.remove("custom-cursor");
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
    };
  }, [rawX, rawY, prefersReducedMotion]);

  if (isTouch || prefersReducedMotion) return null;

  return (
    <>
      {/* Large ambient glow — lags behind for depth */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[9997] h-[360px] w-[360px] rounded-full"
        style={{
          x: orbX,
          y: orbY,
          background:
            "radial-gradient(circle, rgba(34,211,238,0.065) 0%, rgba(52,211,153,0.025) 45%, transparent 70%)",
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.5 } }}
      />

      {/* Medium ring — subtle halo */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[9998] h-8 w-8 rounded-full border border-cyan-400/25"
        style={{
          x: haloX,
          y: haloY,
        }}
        animate={{ opacity: visible ? 0.7 : 0, scale: clicking ? 1.6 : 1 }}
        transition={{ opacity: { duration: 0.3 }, scale: { type: "spring", stiffness: 400, damping: 20 } }}
      />

      {/* Small dot — precise position */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[9999] h-[10px] w-[10px] rounded-full bg-cyan-400"
        style={{
          x: dotX,
          y: dotY,
          boxShadow: "0 0 12px 3px rgba(34,211,238,0.65)",
        }}
        animate={{ opacity: visible ? 1 : 0, scale: clicking ? 0.4 : 1 }}
        transition={{ opacity: { duration: 0.15 }, scale: { type: "spring", stiffness: 600, damping: 20 } }}
      />
    </>
  );
}
