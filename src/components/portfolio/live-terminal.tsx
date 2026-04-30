"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ── Suggested chips ─────────────────────────────────────────────── */
const CHIPS = [
  "Tell me about Befer AI",
  "What's your best project?",
  "I have an idea to discuss",
  "What's your tech stack?",
  "Are you available to hire?",
  "How did you build Leadly AI?",
] as const;

/* ── Boot lines ──────────────────────────────────────────────────── */
const BOOT_LINES = [
  { delay: 0,    text: "✓ JWT auth middleware loaded",        color: "#34d399" },
  { delay: 500,  text: "✓ Stripe webhooks registered",        color: "#34d399" },
  { delay: 1000, text: "→ Server listening on :8080",         color: "#67e8f9" },
  { delay: 1600, text: "→ uptime: 99.9% | latency: <50ms",   color: "#22d3ee" },
  { delay: 2200, text: "→ modules: 60+ | deployments: −35%", color: "#22d3ee" },
];

type Msg = {
  id: string;
  role: "user" | "ai";
  text: string;
  streaming?: boolean;
};

type ConvItem = { role: "user" | "assistant"; content: string };

/* ── Typing dots (shown while waiting for first token) ───────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-violet-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

/* ── Blinking cursor shown at end of streaming text ─────────────── */
function StreamCursor() {
  return (
    <motion.span
      className="ml-0.5 inline-block h-[1em] w-[2px] rounded-sm bg-violet-400 align-middle"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}

/* ── Message bubble ──────────────────────────────────────────────── */
function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Avatar */}
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          isUser
            ? "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/30"
            : "bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30"
        }`}
      >
        {isUser ? "You" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-cyan-500/10 text-zinc-100 ring-1 ring-cyan-400/20"
            : "rounded-tl-sm bg-white/[0.05] text-zinc-200 ring-1 ring-white/[0.08]"
        }`}
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {msg.text}
        {msg.streaming && msg.text.length > 0 && <StreamCursor />}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
export function LiveTerminal() {
  const [bootCount,    setBootCount]    = useState(0);
  const [started,      setStarted]      = useState(false);
  const [messages,     setMessages]     = useState<Msg[]>([]);
  const [history,      setHistory]      = useState<ConvItem[]>([]);
  const [input,        setInput]        = useState("");
  const [waiting,      setWaiting]      = useState(false);   // before first token
  const [streaming,    setStreaming]    = useState(false);   // receiving tokens
  const [chipsVisible, setChipsVisible] = useState(true);

  const containerRef   = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const scrollRef      = useRef<HTMLDivElement>(null);
  const abortRef       = useRef<AbortController | null>(null);
  const prefersReduced = useReducedMotion();

  /* Auto-scroll */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, waiting, bootCount]);

  /* IntersectionObserver */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true); },
      { threshold: 0.25 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [started]);

  /* Boot animation */
  useEffect(() => {
    if (!started) return;
    if (prefersReduced) { setBootCount(BOOT_LINES.length); return; }
    const timers = BOOT_LINES.map((l, i) =>
      setTimeout(() => setBootCount((n) => Math.max(n, i + 1)), l.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [started, prefersReduced]);

  const bootDone = bootCount >= BOOT_LINES.length;
  const isBusy   = waiting || streaming;

  /* Send message — streams response token by token */
  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;

    /* Cancel any previous in-flight request */
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setInput("");
    setChipsVisible(false);

    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setWaiting(true);

    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
        signal: controller.signal,
      });

      if (!res.body) throw new Error("No response body");

      /* Create the AI message shell immediately */
      const aiId = `a-${Date.now()}`;
      setMessages((prev) => [...prev, { id: aiId, role: "ai", text: "", streaming: true }]);
      setWaiting(false);
      setStreaming(true);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        /* Update the streaming message in place */
        setMessages((prev) =>
          prev.map((m) => m.id === aiId ? { ...m, text: fullText } : m)
        );

        /* Keep scrolled to bottom while tokens arrive */
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }

      /* Mark streaming done — removes blinking cursor */
      setMessages((prev) =>
        prev.map((m) => m.id === aiId ? { ...m, streaming: false } : m)
      );

      /* Update conversation history for multi-turn */
      setHistory((prev) => [
        ...prev,
        { role: "user",      content: trimmed   },
        { role: "assistant", content: fullText   },
      ]);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setWaiting(false);
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "ai", text: "Connection dropped — give it a second and try again." },
      ]);
    } finally {
      setWaiting(false);
      setStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isBusy, history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl">

      {/* Identity label */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-400" />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            AI Assistant
          </span>
        </div>
        <span className="h-px flex-1 bg-gradient-to-r from-violet-400/30 to-transparent" />
        <span className="text-[10px] text-zinc-600">Ask anything · discuss ideas · explore projects</span>
      </div>

      {/* Main window */}
      <motion.div
        className="terminal-window flex h-[340px] flex-col overflow-hidden rounded-2xl border border-white/[0.09] backdrop-blur-md sm:h-[420px]"
        style={{
          background: "rgba(10,10,18,0.94)",
          boxShadow: "0 0 0 1px rgba(167,139,250,0.12), 0 24px 64px -20px rgba(0,0,0,0.65), 0 0 48px -14px rgba(167,139,250,0.18)",
        }}
        whileHover={{
          boxShadow: "0 0 0 1px rgba(167,139,250,0.25), 0 28px 72px -20px rgba(0,0,0,0.75), 0 0 56px -10px rgba(167,139,250,0.28)",
        }}
        transition={{ duration: 0.3 }}
        onClick={() => bootDone && !isBusy && inputRef.current?.focus()}
      >
        {/* Title bar */}
        <div
          className="flex shrink-0 items-center gap-2 border-b px-4 py-2.5"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.025)" }}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
              style={{ background: "rgba(167,139,250,0.12)", color: "#c084fc", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              AI Chat
            </span>
          </div>
          <span className="ml-auto font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            backend · production · ai-enabled
          </span>
        </div>

        {/* Scroll body */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-1 chat-scroll"
        >
          {/* Boot sequence */}
          <div className="space-y-1 font-mono text-xs mb-4">
            {BOOT_LINES.map((l, i) => (
              <div
                key={i}
                className="transition-all duration-300"
                style={{
                  color: l.color,
                  opacity: i < bootCount ? 1 : 0,
                  transform: i < bootCount ? "translateY(0)" : "translateY(4px)",
                }}
              >
                {l.text}
              </div>
            ))}
          </div>

          {/* Welcome message */}
          <AnimatePresence>
            {bootDone && messages.length === 0 && !waiting && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2.5"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-bold text-violet-300 ring-1 ring-violet-400/30">
                  AI
                </div>
                <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-white/[0.05] px-4 py-2.5 text-sm leading-relaxed text-zinc-200 ring-1 ring-white/[0.08]">
                  Hey! I&apos;m Hannan&apos;s AI — I know everything about his projects, skills, and experience.
                  {" "}Ask me anything, or share an idea you&apos;d like to explore. 👋
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="space-y-3 mt-2">
            {messages.map((m) => <Bubble key={m.id} msg={m} />)}
          </div>

          {/* Waiting for first token — show dots */}
          <AnimatePresence>
            {waiting && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-bold text-violet-300 ring-1 ring-violet-400/30">
                  AI
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white/[0.05] px-4 py-2.5 ring-1 ring-white/[0.08]">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chips */}
        <AnimatePresence>
          {bootDone && chipsVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="shrink-0 overflow-hidden"
            >
              <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 scrollbar-none [scrollbar-width:none]" style={{ WebkitOverflowScrolling: "touch" }}>
                {CHIPS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => send(c)}
                    disabled={isBusy}
                    className="shrink-0 rounded-full border border-white/[0.09] bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-400 transition-colors hover:border-violet-400/40 hover:bg-violet-400/[0.07] hover:text-violet-300 active:scale-95 disabled:pointer-events-none disabled:opacity-30"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div
          className="shrink-0 border-t px-4 py-3"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
        >
          {bootDone ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isBusy}
                placeholder={
                  waiting   ? "Thinking…" :
                  streaming ? "Generating…" :
                  "Ask about projects, skills, or share your idea…"
                }
                className="flex-1 bg-white/[0.03] rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none border border-white/[0.05] transition-all focus:border-violet-400/30 focus:bg-white/[0.06] disabled:opacity-40"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                disabled={isBusy || !input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/80 text-white shadow-[0_0_16px_-4px_rgba(167,139,250,0.7)] transition-all hover:bg-violet-500 disabled:opacity-30 disabled:shadow-none active:scale-95"
                aria-label="Send"
              >
                {isBusy ? (
                  <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M2.87 2.298a.75.75 0 0 0-.812 1.021L3.39 6.624a1 1 0 0 0 .928.626H8.25a.75.75 0 0 1 0 1.5H4.318a1 1 0 0 0-.927.626l-1.333 3.305a.75.75 0 0 0 .811 1.022l11-4.25a.75.75 0 0 0 0-1.396l-11-4.25Z" />
                  </svg>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="font-mono text-[10px] text-zinc-600 animate-pulse">initialising…</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
          )}
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.15); border-radius: 10px; }
        .chat-scroll::-webkit-scrollbar-thumb:hover { background: rgba(167,139,250,0.28); }
      ` }} />
    </div>
  );
}
