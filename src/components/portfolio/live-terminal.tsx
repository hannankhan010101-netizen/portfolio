"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const INITIAL_LINES = [
  { delay: 0,    text: "$ node server.js --env production", type: "cmd" as const },
  { delay: 600,  text: "✓ Connected to MySQL cluster",       type: "success" as const },
  { delay: 1100, text: "✓ Redis cache initialized (2.1ms)",  type: "success" as const },
  { delay: 1600, text: "✓ JWT auth middleware loaded",        type: "success" as const },
  { delay: 2100, text: "✓ Stripe webhooks registered",        type: "success" as const },
  { delay: 2700, text: "→ Server listening on :8080",         type: "info" as const },
  { delay: 3300, text: "→ uptime: 99.9% | latency: <50ms",   type: "metric" as const },
  { delay: 3900, text: "→ modules: 60+ | deployments: −35%", type: "metric" as const },
  { delay: 4500, text: "→ AI Terminal ready. Type a command (e.g. 'help').", type: "info" as const },
];

type LineType = (typeof INITIAL_LINES)[number]["type"] | "user" | "ai";

function lineColor(type: LineType): string {
  switch (type) {
    case "cmd":     return "#e4e4e7";   /* zinc-200 */
    case "success": return "#34d399";   /* emerald-400 */
    case "info":    return "#67e8f9";   /* cyan-300 */
    case "metric":  return "#22d3ee";   /* cyan-400 */
    case "user":    return "#f4f4f5";   /* zinc-100 */
    case "ai":      return "#c084fc";   /* purple-400 */
    default:        return "#e4e4e7";
  }
}

type HistoryItem = { id: string; text: string; type: LineType };

export function LiveTerminal() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (prefersReducedMotion) { setVisibleCount(INITIAL_LINES.length); return; }
    const timers = INITIAL_LINES.map((line, i) =>
      setTimeout(() => setVisibleCount((n) => Math.max(n, i + 1)), line.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [started, prefersReducedMotion]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount, history, isProcessing]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const cmd = inputValue.trim();
    setInputValue("");
    
    // Add user command to history
    const newHistory = [...history, { id: Date.now().toString(), text: `$ ${cmd}`, type: "user" as const }];
    setHistory(newHistory);
    setIsProcessing(true);

    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      
      if (data.ok) {
        setHistory((prev) => [
          ...prev, 
          { id: (Date.now() + 1).toString(), text: data.message, type: "ai" }
        ]);
      } else {
        setHistory((prev) => [
          ...prev, 
          { id: (Date.now() + 1).toString(), text: `Error: ${data.message}`, type: "info" }
        ]);
      }
    } catch (err) {
      setHistory((prev) => [
        ...prev, 
        { id: (Date.now() + 1).toString(), text: "Connection failed. Please try again.", type: "info" }
      ]);
    } finally {
      setIsProcessing(false);
      // Keep focus on input
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const isBootComplete = visibleCount >= INITIAL_LINES.length;

  return (
    <motion.div
      ref={ref}
      className="terminal-window w-full max-w-xl overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm flex flex-col"
      style={{
        background: "rgba(13, 13, 20, 0.92)",
        boxShadow: "0 0 0 1px rgba(34,211,238,0.08), 0 20px 60px -20px rgba(0,0,0,0.6), 0 0 40px -12px rgba(34,211,238,0.15)",
        height: "400px" // Fixed height so it scrolls instead of expanding endlessly
      }}
      whileHover={{ boxShadow: "0 0 0 1px rgba(34,211,238,0.20), 0 24px 70px -20px rgba(0,0,0,0.7), 0 0 50px -10px rgba(34,211,238,0.25)" }}
      transition={{ duration: 0.3 }}
      onClick={() => isBootComplete && inputRef.current?.focus()}
    >
      {/* Mac-style title bar */}
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5 shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
        <span className="ml-auto text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
          backend · production · ai-enabled
        </span>
      </div>

      {/* Terminal body */}
      <div 
        ref={scrollRef}
        className="space-y-1.5 px-4 py-4 font-mono text-xs sm:text-sm overflow-y-auto flex-1 custom-scrollbar pb-10"
      >
        {/* Boot sequence */}
        {INITIAL_LINES.map((line, i) => (
          <div
            key={`boot-${i}`}
            className="transition-all duration-300"
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? "translateY(0)" : "translateY(4px)",
              color: lineColor(line.type),
              fontWeight: line.type === "metric" ? 600 : 400,
            }}
          >
            {line.text}
          </div>
        ))}
        
        {/* History */}
        {history.map((item) => (
          <div
            key={item.id}
            style={{ color: lineColor(item.type), whiteSpace: "pre-wrap" }}
            className="mt-2 leading-relaxed"
          >
            {item.text}
          </div>
        ))}

        {/* Loading state */}
        {isProcessing && (
          <div className="mt-2 animate-pulse flex items-center gap-2" style={{ color: "#c084fc" }}>
            <svg
              className="h-3 w-3 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            processing...
          </div>
        )}

        {/* Input line */}
        {isBootComplete && !isProcessing && (
          <form onSubmit={handleCommand} className="mt-2 flex items-center gap-2 relative">
            <span style={{ color: "rgba(255,255,255,0.3)" }}>$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-zinc-100 placeholder:text-white/20 caret-cyan-400 font-mono text-xs sm:text-sm"
              placeholder="Ask me anything..."
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}} />
    </motion.div>
  );
}
