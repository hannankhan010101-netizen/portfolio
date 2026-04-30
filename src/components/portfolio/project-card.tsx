"use client";

import { motion, useInView, useReducedMotion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
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
  { border: "rgba(34,211,238,0.35)",   dot: "bg-cyan-400",    dotGlow: "shadow-[0_0_8px_rgba(34,211,238,0.9)]",    text: "text-cyan-400",    badge: "border-cyan-400/20 bg-cyan-400/[0.06]",    chip: "border-cyan-400/15 bg-cyan-400/[0.04] text-cyan-300",    glow: "rgba(34,211,238,0.6)",    color: "#22d3ee", bar: "from-cyan-400 to-emerald-400" },
  { border: "rgba(167,139,250,0.35)",  dot: "bg-violet-400",  dotGlow: "shadow-[0_0_8px_rgba(167,139,250,0.9)]",   text: "text-violet-400",  badge: "border-violet-400/20 bg-violet-400/[0.06]",  chip: "border-violet-400/15 bg-violet-400/[0.04] text-violet-300",  glow: "rgba(167,139,250,0.6)",  color: "#a78bfa", bar: "from-violet-400 to-cyan-400" },
  { border: "rgba(52,211,153,0.35)",   dot: "bg-emerald-400", dotGlow: "shadow-[0_0_8px_rgba(52,211,153,0.9)]",    text: "text-emerald-400", badge: "border-emerald-400/20 bg-emerald-400/[0.06]", chip: "border-emerald-400/15 bg-emerald-400/[0.04] text-emerald-300", glow: "rgba(52,211,153,0.6)",  color: "#34d399", bar: "from-emerald-400 to-cyan-400" },
  { border: "rgba(251,191,36,0.35)",   dot: "bg-amber-400",   dotGlow: "shadow-[0_0_8px_rgba(251,191,36,0.9)]",    text: "text-amber-400",   badge: "border-amber-400/20 bg-amber-400/[0.06]",   chip: "border-amber-400/15 bg-amber-400/[0.04] text-amber-300",   glow: "rgba(251,191,36,0.6)",  color: "#fbbf24", bar: "from-amber-400 to-rose-400" },
  { border: "rgba(251,113,133,0.35)",  dot: "bg-rose-400",    dotGlow: "shadow-[0_0_8px_rgba(251,113,133,0.9)]",   text: "text-rose-400",    badge: "border-rose-400/20 bg-rose-400/[0.06]",    chip: "border-rose-400/15 bg-rose-400/[0.04] text-rose-300",    glow: "rgba(251,113,133,0.6)", color: "#fb7185", bar: "from-rose-400 to-violet-400" },
] as const;

/* ─── Cinematic Video Player ──────────────────────────────────────────────── */
function CinematicVideo({
  src,
  title,
  accentBar,
  accentGlow,
  accentColor,
}: {
  src: string;
  title: string;
  accentBar: string;
  accentGlow: string;
  accentColor: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const hideTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging   = useRef(false);

  const [playing,      setPlaying]      = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress,     setProgress]     = useState(0);
  const [buffered,     setBuffered]     = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [current,      setCurrent]      = useState(0);
  const [muted,        setMuted]        = useState(true);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  function fmt(s: number) {
    if (!isFinite(s) || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  }

  /* Auto-play via IntersectionObserver */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          v.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Fullscreen change listener */
  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  /* Reveal controls + auto-hide */
  const revealControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 2800);
  }, []);

  /* Seek from clientX */
  const seekTo = useCallback((clientX: number) => {
    const v = videoRef.current;
    const el = containerRef.current;
    if (!v || !el || !v.duration) return;
    const bar = el.querySelector<HTMLDivElement>("[data-scrubber]");
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
    setProgress(pct * 100);
  }, []);

  /* Draggable progress bar */
  function handleScrubMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    isDragging.current = true;
    seekTo(e.clientX);

    function onMove(ev: MouseEvent) { if (isDragging.current) seekTo(ev.clientX); }
    function onUp()  { isDragging.current = false; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",  onUp);
  }

  function togglePlay(e?: React.MouseEvent) {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else         { v.play().then(() => setPlaying(true)).catch(() => {}); }
    revealControls();
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function toggleFullscreen(e: React.MouseEvent) {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen().catch(() => {});
    }
  }

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration || isDragging.current) return;
    setCurrent(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100);
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer select-none overflow-hidden bg-zinc-950"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={revealControls}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
      onClick={togglePlay}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        playsInline
        preload="metadata"
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => { setDuration(videoRef.current?.duration ?? 0); setIsLoading(false); }}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onEnded={() => setPlaying(false)}
        className="h-full w-full object-cover"
        style={{
          transform: playing ? "scale(1.045)" : "scale(1)",
          filter: playing ? "brightness(1)" : "brightness(0.75)",
          transition: "transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.7s ease",
        }}
      />

      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }}
      />

      {/* Radial vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]" style={{ background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />

      {/* Top gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-28 bg-gradient-to-b from-black/70 to-transparent" />

      {/* Bottom gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-36 bg-gradient-to-t from-black/90 to-transparent" />

      {/* Loading spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="spinner"
            className="pointer-events-none absolute inset-0 z-[8] flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div
              className="h-8 w-8 rounded-full border-2 border-transparent animate-spin"
              style={{ borderTopColor: accentColor, borderRightColor: accentColor + "44" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar: title + badge */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            key="topbar"
            className="absolute inset-x-0 top-0 z-[9] flex items-start justify-between px-4 pt-4"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/90 shadow-lg backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
              {title}
            </span>
            <span
              className="rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md"
              style={{ borderColor: accentColor + "55", backgroundColor: accentColor + "22", color: accentColor }}
            >
              Demo
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Playing" badge when controls hidden */}
      <AnimatePresence>
        {playing && !showControls && (
          <motion.div
            key="playing-badge"
            className="absolute bottom-4 right-4 z-[9] flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-white/60">Playing</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle play button with pulsing rings */}
      <AnimatePresence>
        {!playing && !isLoading && (
          <motion.div
            key="playbtn"
            className="pointer-events-none absolute inset-0 z-[7] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring 1 */}
              <div
                className="absolute h-24 w-24 animate-ping rounded-full opacity-20"
                style={{ backgroundColor: accentColor, animationDuration: "2.4s" }}
              />
              {/* Outer pulsing ring 2 */}
              <div
                className="absolute h-20 w-20 animate-ping rounded-full opacity-25"
                style={{ backgroundColor: accentColor, animationDuration: "2.4s", animationDelay: "0.6s" }}
              />
              {/* Button */}
              <div
                className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-xl"
                style={{ boxShadow: `0 0 50px -8px ${accentColor}, 0 0 0 1px rgba(255,255,255,0.08) inset` }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-5 w-5" style={{ color: accentColor }}>
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-visible 2px progress strip at very bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-[2px]">
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${buffered}%`, transition: "width 0.3s ease" }} />
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${accentBar}`}
          style={{ width: `${progress}%`, transition: isDragging.current ? "none" : "width 0.1s linear" }}
        />
      </div>

      {/* Glassmorphic control bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            key="controls"
            className="absolute inset-x-0 bottom-0 z-[10] px-3 pb-3 pt-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center gap-3 rounded-2xl border border-white/[0.08] px-4 py-2.5 shadow-2xl"
              style={{ backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", backgroundColor: "rgba(0,0,0,0.55)" }}
            >
              {/* Play/Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/10 hover:text-white active:scale-95"
              >
                {playing ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Draggable scrubber */}
              <div
                data-scrubber
                className="group/track relative flex h-5 flex-1 cursor-pointer items-center"
                onMouseDown={handleScrubMouseDown}
              >
                {/* Track base */}
                <div className="absolute inset-x-0 h-[3px] overflow-hidden rounded-full bg-white/10 transition-all duration-200 group-hover/track:h-[5px]">
                  {/* Buffered */}
                  <div className="absolute inset-y-0 left-0 rounded-full bg-white/20" style={{ width: `${buffered}%`, transition: "width 0.4s ease" }} />
                  {/* Played */}
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${accentBar}`}
                    style={{ width: `${progress}%`, transition: isDragging.current ? "none" : "width 0.08s linear" }}
                  />
                </div>
                {/* Thumb dot */}
                <div
                  className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-px rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover/track:opacity-100"
                  style={{
                    left: `${progress}%`,
                    boxShadow: `0 0 10px 2px ${accentColor}88, 0 0 0 2px rgba(255,255,255,0.9)`,
                  }}
                />
              </div>

              {/* Time */}
              <span className="shrink-0 w-[68px] text-center font-mono text-[9px] font-medium tracking-wider text-white/45">
                {fmt(current)}<span className="mx-0.5 text-white/20">/</span>{fmt(duration)}
              </span>

              {/* Mute */}
              <button
                type="button"
                onClick={toggleMute}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/55 transition-all hover:bg-white/10 hover:text-white active:scale-95"
              >
                {muted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M7.557 2.066A.75.75 0 0 1 8 2.75v10.5a.75.75 0 0 1-1.248.56L3.59 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.59l3.162-2.81a.75.75 0 0 1 .805-.124ZM12.78 5.22a.75.75 0 1 0-1.06 1.06L13.44 8l-1.72 1.72a.75.75 0 0 0 1.06 1.06L14.5 9.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L15.56 8l1.72-1.72a.75.75 0 0 0-1.06-1.06L14.5 6.94l-1.72-1.72Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M7.557 2.066A.75.75 0 0 1 8 2.75v10.5a.75.75 0 0 1-1.248.56L3.59 11H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.59l3.162-2.81a.75.75 0 0 1 .805-.124ZM11.28 4.22a.75.75 0 1 0-1.06 1.06 4.5 4.5 0 0 1 0 5.44.75.75 0 0 0 1.06 1.06 6 6 0 0 0 0-7.56ZM13.96 2.06a.75.75 0 0 0-1.06 1.06A8.25 8.25 0 0 1 14.94 8c0 1.89-.636 3.628-1.7 5.01a.75.75 0 1 0 1.14.98A9.75 9.75 0 0 0 16.44 8a9.75 9.75 0 0 0-2.48-5.94Z" />
                  </svg>
                )}
              </button>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/55 transition-all hover:bg-white/10 hover:text-white active:scale-95"
              >
                {isFullscreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M5.25 1a.75.75 0 0 1 .75.75V4.5h2.75a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75V1.75A.75.75 0 0 1 5.25 1ZM10.75 1a.75.75 0 0 1 .75.75V5.25A.75.75 0 0 1 10.75 6H8a.75.75 0 0 1 0-1.5h2V1.75a.75.75 0 0 1 .75-.75ZM1.75 10a.75.75 0 0 1 .75.75V13h2.25a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 13.75v-3a.75.75 0 0 1 .75-.75ZM14.25 10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75H11.5a.75.75 0 0 1 0-1.5H13v-2.25a.75.75 0 0 1 .75-.75Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M1 1.75A.75.75 0 0 1 1.75 1H5a.75.75 0 0 1 0 1.5H3.56L5.78 4.72a.75.75 0 1 1-1.06 1.06L2.5 3.56V5a.75.75 0 0 1-1.5 0V1.75ZM11 1.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 .75.75V5a.75.75 0 0 1-1.5 0V3.56l-2.22 2.22a.75.75 0 1 1-1.06-1.06l2.22-2.22H11.75A.75.75 0 0 1 11 1.75ZM5.78 10.22a.75.75 0 0 1 0 1.06L3.56 13.5H5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 14.25V11a.75.75 0 0 1 1.5 0v1.44l2.22-2.22a.75.75 0 0 1 1.06 0ZM14.5 11v1.44l-2.22-2.22a.75.75 0 1 0-1.06 1.06l2.22 2.22H12a.75.75 0 0 0 0 1.5h3.25a.75.75 0 0 0 .75-.75V11a.75.75 0 0 0-1.5 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Project Card ─────────────────────────────────────────────────────────── */
export function ProjectCard({ project, onOpenArchitecture, index = 0 }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: "some", margin: "0px 0px 12% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const delay    = index * 0.07;
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const accent   = CARD_ACCENTS[index % CARD_ACCENTS.length];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]),  { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]),  { stiffness: 300, damping: 30 });

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
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-zinc-950/60 shadow-lg shadow-black/30"
      style={prefersReducedMotion ? undefined : {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 32, borderColor: "rgba(255, 255, 255, 0.1)", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)" }}
      animate={prefersReducedMotion ? undefined : isInView ? { opacity: 1, y: 0, borderColor: "rgba(255, 255, 255, 0.1)", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)" } : { opacity: 0, y: 32, borderColor: "rgba(255, 255, 255, 0.1)", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)" }}
      transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASE, delay }}
      whileHover={prefersReducedMotion ? undefined : {
        borderColor: accent.border,
        boxShadow: `0 32px 64px -32px rgba(0,0,0,0.8), 0 0 0 1px ${accent.border.replace("0.35", "0.06")} inset`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sheen */}
      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(400px circle at var(--mouse-x,50%) var(--mouse-y,50%),rgba(255,255,255,0.03),transparent 60%)" }}
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

      {/* Cinematic video player */}
      {project.videoUrl && (
        <div className="border-b border-white/[0.06]">
          <CinematicVideo
            src={project.videoUrl}
            title={project.name}
            accentBar={accent.bar}
            accentGlow={accent.glow}
            accentColor={accent.color}
          />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col gap-5 p-6">
        <p className="text-sm leading-relaxed text-zinc-400">{project.summary}</p>

        {/* Key features */}
        <div>
          <h4 className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Key Features</h4>
          <div className="flex flex-wrap gap-1.5">
            {project.keyFeatures.map((feature) => (
              <span
                key={feature}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-400"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Tech stack */}
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
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-400 underline-offset-4 transition-colors hover:text-cyan-300 hover:underline"
            >
              GitHub ↗
            </a>
            {project.liveDemoUrl ? (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-medium underline-offset-4 transition-colors hover:underline ${accent.text}`}
              >
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
