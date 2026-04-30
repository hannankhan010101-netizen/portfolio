"use client";

import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SectionEyebrow } from "@/components/portfolio/section-eyebrow";

/* ─────────────────────────────────────────────────────────────────────────────
   Card 1 — Live AI Terminal
   Fully interactive: quick-chips + real Groq API + streaming character-by-char
───────────────────────────────────────────────────────────────────────────── */
const QUICK_PROMPTS = [
  { label: "Stack?",        q: "What's your full tech stack?" },
  { label: "Rate?",         q: "What's your freelance rate?" },
  { label: "Best project?", q: "Tell me about your best project." },
  { label: "Availability?", q: "Are you available right now?" },
];

/* Instant canned answers so the card works even without API */
const CANNED: Record<string, string> = {
  "What's your full tech stack?":
    "Backend: Node.js · Fastify · Python/FastAPI\nDB: MySQL · Redis · Supabase\nCloud: Docker · GitHub Actions\nAPIs: Stripe · OpenAI · Twilio · Meta · Google",
  "What's your freelance rate?":
    "Depends on scope — backend systems, API integrations, and CRM architecture are my sweet spot. DM via the Contact section with your requirements for a fast quote.",
  "Tell me about your best project.":
    "Multi-tenant CRM @ Hatzs — 60+ backend modules, AI lead engine processing 1,000+ interactions/min, Stripe+QuickBooks sync, 99.9% uptime over 12 months. Pure Node.js + Redis + MySQL.",
  "Are you available right now?":
    "Yes — open for freelance projects and full-time roles. Backend-heavy work preferred. Response time < 24 hrs.",
};

function TerminalCard() {
  type Msg = { role: "user" | "ai"; text: string };
  const [msgs, setMsgs]         = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [busy, setBusy]         = useState(false);
  const [streaming, setStreaming] = useState("");
  const scrollRef                = useRef<HTMLDivElement>(null);
  const inputRef                 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, streaming]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", text: q }]);
    setBusy(true);
    setStreaming("");

    const canned = CANNED[q];
    const reply = canned ?? await fetchTerminal(q);

    typeOut(reply, (chunk) => setStreaming(chunk), () => {
      setMsgs(p => [...p, { role: "ai", text: reply }]);
      setStreaming("");
      setBusy(false);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Window */}
      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#07070f]">
        {/* Title bar */}
        <div className="flex items-center gap-1.5 border-b border-white/[0.05] px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 font-mono text-[10px] text-zinc-600">portfolio-ai ~</span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[9px] text-emerald-500">live · ai</span>
          </span>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="max-h-[148px] min-h-[90px] overflow-y-auto scroll-smooth p-3 font-mono text-[11px] leading-relaxed space-y-1.5"
        >
          {msgs.length === 0 && (
            <p className="text-zinc-700">Type a question or tap a chip below ↓</p>
          )}
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={m.role === "user" ? "text-zinc-200" : "text-violet-300 whitespace-pre-line"}
            >
              {m.role === "user"
                ? <><span className="text-cyan-500">❯</span> {m.text}</>
                : <><span className="text-violet-500">AI</span> {m.text}</>}
            </motion.div>
          ))}
          {streaming && (
            <div className="whitespace-pre-line text-violet-300">
              <span className="text-violet-500">AI</span> {streaming}
              <span className="animate-pulse text-violet-400">▌</span>
            </div>
          )}
          {busy && !streaming && (
            <div className="flex items-center gap-1.5 text-violet-500 text-[10px]">
              <span className="text-violet-500">AI</span>
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="inline-block h-1 w-1 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.13}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Input row */}
        <div className="flex items-center gap-2 border-t border-white/[0.05] px-3 py-2">
          <span className="font-mono text-[11px] text-cyan-500">❯</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
            placeholder="ask anything..."
            disabled={busy}
            className="flex-1 bg-transparent font-mono text-[11px] text-zinc-200 placeholder-zinc-700 outline-none disabled:opacity-50"
          />
          <button
            onClick={() => send(input)}
            disabled={busy || !input.trim()}
            className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 opacity-60 hover:opacity-100 disabled:opacity-20 transition-opacity"
          >
            run
          </button>
        </div>
      </div>

      {/* Quick-chip prompts */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map(({ label, q }) => (
          <button
            key={label}
            onClick={() => send(q)}
            disabled={busy}
            className="rounded-full border border-violet-400/20 bg-violet-400/[0.05] px-2.5 py-1 text-[10px] font-semibold text-violet-400 hover:bg-violet-400/10 hover:border-violet-400/40 disabled:opacity-30 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

async function fetchTerminal(command: string): Promise<string> {
  try {
    const res = await fetch("/api/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });
    const data = await res.json();
    return data.message ?? "No response.";
  } catch {
    return "Connection error. Try again.";
  }
}

function typeOut(text: string, onChunk: (s: string) => void, onDone: () => void) {
  let i = 0;
  const speed = text.length > 200 ? 8 : 14;
  const tick = () => {
    i++;
    onChunk(text.slice(0, i));
    if (i < text.length) setTimeout(tick, speed);
    else setTimeout(onDone, 80);
  };
  setTimeout(tick, 300);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Card 2 — ELI5 Architecture Translator
   3 presets + custom textarea + real API + streaming + complexity badge
───────────────────────────────────────────────────────────────────────────── */
const ELI5_PRESETS = [
  {
    label: "CRM Platform",
    tech: "Multi-tenant MySQL with row-level isolation, Redis pub/sub, JWT auth middleware, Docker Compose, Stripe webhooks + idempotency keys, Fastify rate-limiting, organization-scoped ACL",
  },
  {
    label: "AI Automation",
    tech: "OpenAI GPT-4o webhook pipeline, async Bull/Redis job queue, WebSocket real-time event stream, N8N workflow orchestration, vector embeddings, rate-limiter with token bucket",
  },
  {
    label: "Payment Layer",
    tech: "Stripe Connect multi-party payouts, QuickBooks OAuth2 sync, idempotency-key retry logic, webhook signature verification, ACID transactions, revenue reconciliation cron",
  },
];

function Eli5Card() {
  const [idx, setIdx]               = useState(0);
  const [useCustom, setUseCustom]   = useState(false);
  const [custom, setCustom]         = useState("");
  const [result, setResult]         = useState("");
  const [streaming, setStreaming]   = useState("");
  const [busy, setBusy]             = useState(false);

  const activeText = useCustom ? custom : ELI5_PRESETS[idx].tech;
  const activeName = useCustom ? "Custom Architecture" : ELI5_PRESETS[idx].label;

  async function translate() {
    if (!activeText.trim() || busy) return;
    setBusy(true);
    setResult("");
    setStreaming("");
    try {
      const res = await fetch("/api/eli5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: activeText, projectName: activeName }),
      });
      const data = await res.json();
      const reply = data.message ?? "Could not simplify.";
      typeOut(reply, setStreaming, () => {
        setResult(reply);
        setStreaming("");
        setBusy(false);
      });
    } catch {
      setResult("Error — try again.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Preset tabs */}
      <div className="flex flex-wrap gap-1.5">
        {ELI5_PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => { setIdx(i); setUseCustom(false); setResult(""); setStreaming(""); }}
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
              !useCustom && idx === i
                ? "border border-emerald-400/35 bg-emerald-400/10 text-emerald-400"
                : "border border-white/[0.07] text-zinc-500 hover:text-zinc-300 hover:border-white/15"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => { setUseCustom(true); setResult(""); setStreaming(""); }}
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
            useCustom
              ? "border border-emerald-400/35 bg-emerald-400/10 text-emerald-400"
              : "border border-white/[0.07] text-zinc-500 hover:text-zinc-300 hover:border-white/15"
          }`}
        >
          ✏ Custom
        </button>
      </div>

      {/* Input area */}
      <div className="rounded-lg border border-white/[0.07] bg-zinc-950/60 p-3">
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-600">Technical Stack</p>
        {useCustom ? (
          <textarea
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="Paste any technical architecture, stack, or system description..."
            className="w-full resize-none bg-transparent font-mono text-[11px] leading-relaxed text-zinc-400 placeholder-zinc-700 outline-none"
            rows={3}
          />
        ) : (
          <p className="font-mono text-[11px] leading-relaxed text-zinc-400">{ELI5_PRESETS[idx].tech}</p>
        )}
      </div>

      {/* Button */}
      <motion.button
        onClick={translate}
        disabled={busy || (useCustom && !custom.trim())}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.06] py-2.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 transition-colors hover:bg-emerald-400/10 disabled:opacity-40"
      >
        {busy ? (
          <>
            {[0,1,2].map(i => (
              <span key={i} className="h-1 w-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: `${i*0.13}s` }} />
            ))}
            Translating...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M5 4a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h.75v.75a.75.75 0 0 0 1.5 0V11H8a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H5ZM3.5 7A1.5 1.5 0 0 1 5 5.5h3A1.5 1.5 0 0 1 9.5 7v1A1.5 1.5 0 0 1 8 9.5H5A1.5 1.5 0 0 1 3.5 8V7Zm8.25-2.25a.75.75 0 0 0 0 1.5H13V7.5h-1.25a.75.75 0 0 0 0 1.5H13V10a1.5 1.5 0 0 1-1.5 1.5h-.75a.75.75 0 0 0 0 1.5h.75A3 3 0 0 0 14.5 10V6a3 3 0 0 0-3-3h-.75a.75.75 0 0 0 0 1.5h.75A1.5 1.5 0 0 1 13 6v.25h-1.25Z" clipRule="evenodd" />
            </svg>
            Explain Like I&apos;m 5
          </>
        )}
      </motion.button>

      {/* Output */}
      <AnimatePresence>
        {(result || streaming) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05] p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-500">AI Simplified</p>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-px text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                  Jargon-free
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-300">
                {result || streaming}
                {streaming && !result && <span className="animate-pulse">▌</span>}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Card 3 — Smart Outreach Ghostwriter
   4 persona buttons, editable fields, real Groq API, copy button
───────────────────────────────────────────────────────────────────────────── */
const PERSONAS = [
  { emoji: "🚀", label: "Founder",    role: "Startup Founder",  intent: "Build a scalable backend for our SaaS MVP" },
  { emoji: "👨‍💻", label: "Tech Lead",  role: "Tech Lead",         intent: "Backend architecture review and modernization" },
  { emoji: "🎯", label: "Recruiter",  role: "Recruiter",         intent: "Full-time Software Engineer II opportunity" },
  { emoji: "🏢", label: "Agency",     role: "Agency Director",   intent: "Freelance backend developer for client project" },
];

function GhostwriterCard() {
  const [personaIdx, setPersonaIdx]   = useState<number | null>(null);
  const [name, setName]               = useState("");
  const [intent, setIntent]           = useState("");
  const [result, setResult]           = useState("");
  const [streaming, setStreaming]     = useState("");
  const [busy, setBusy]               = useState(false);
  const [copied, setCopied]           = useState(false);

  function pickPersona(i: number) {
    setPersonaIdx(i);
    setIntent(PERSONAS[i].intent);
    setResult("");
    setStreaming("");
  }

  async function generate() {
    if (busy || !name.trim()) return;
    setBusy(true);
    setResult("");
    setStreaming("");
    try {
      const res = await fetch("/api/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role: personaIdx !== null ? PERSONAS[personaIdx].role : "",
          intent,
          subject: intent,
          brief: intent,
        }),
      });
      const data = await res.json();
      const reply = data.message ?? "Could not generate message.";
      typeOut(reply, setStreaming, () => {
        setResult(reply);
        setStreaming("");
        setBusy(false);
      });
    } catch {
      setResult("Error — try again.");
      setBusy(false);
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-3">
      {/* Persona picker */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-zinc-600">Who are you?</p>
        <div className="grid grid-cols-2 gap-1.5">
          {PERSONAS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => pickPersona(i)}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[10px] font-semibold transition-colors text-left ${
                personaIdx === i
                  ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                  : "border-white/[0.07] bg-white/[0.02] text-zinc-500 hover:border-white/[0.14] hover:text-zinc-300"
              }`}
            >
              <span className="text-sm leading-none">{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">Your name</p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
            placeholder="e.g. Alex"
            className="w-full bg-transparent text-[11px] text-zinc-300 placeholder-zinc-700 outline-none"
          />
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2">
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-600">What you need</p>
          <input
            value={intent}
            onChange={e => setIntent(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
            placeholder="e.g. API integration"
            className="w-full bg-transparent text-[11px] text-zinc-300 placeholder-zinc-700 outline-none"
          />
        </div>
      </div>

      {/* Generate button */}
      <motion.button
        onClick={generate}
        disabled={busy || !name.trim()}
        whileTap={{ scale: 0.98 }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/25 bg-cyan-400/[0.06] py-2.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 transition-colors hover:bg-cyan-400/10 disabled:opacity-40"
      >
        {busy ? (
          <>
            {[0,1,2].map(i => (
              <span key={i} className="h-1 w-1 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i*0.13}s` }} />
            ))}
            Ghostwriting...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
              <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9a.75.75 0 0 1 1.5 0v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
            </svg>
            Generate Outreach
          </>
        )}
      </motion.button>

      {/* Result */}
      <AnimatePresence>
        {(result || streaming) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-500">AI-Drafted Message</p>
                {result && (
                  <button
                    onClick={copy}
                    className="flex items-center gap-1 rounded-md border border-cyan-400/20 bg-cyan-400/[0.06] px-2 py-0.5 text-[9px] font-bold text-cyan-400 hover:bg-cyan-400/12 transition-colors"
                  >
                    {copied ? (
                      <><span className="text-emerald-400">✓</span> Copied!</>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5">
                          <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h6a1.5 1.5 0 0 0 1.5-1.5V8.621a1.5 1.5 0 0 0-.44-1.06L7.439 4.44A1.5 1.5 0 0 0 6.379 4H3.5Z" />
                          <path d="M12.5 2H10v1.5h2v9h-4.5V14H12.5A1.5 1.5 0 0 0 14 12.5v-9A1.5 1.5 0 0 0 12.5 2Z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-[11px] leading-relaxed text-cyan-200/90">
                {result || streaming}
                {streaming && !result && <span className="animate-pulse text-cyan-400">|</span>}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Section layout
───────────────────────────────────────────────────────────────────────────── */
const CARDS = [
  {
    id: "terminal",
    title: "Live AI Terminal",
    badge: "Live · AI",
    desc: "Interactive AI that knows my entire career — stack, projects, rate, availability. Type anything or tap a chip.",
    cta: "↓ Full terminal in the Hero section",
    accent: {
      ring: "border-violet-400/20",
      glow: "rgba(139,92,246,0.15)",
      text: "text-violet-400",
      bg: "bg-violet-400/[0.04]",
      bar: "from-violet-500 to-violet-400",
    },
    Demo: TerminalCard,
  },
  {
    id: "eli5",
    title: "ELI5 Architecture",
    badge: "Demo · AI",
    desc: "Pick a preset or paste any technical stack. AI instantly translates engineering jargon into plain business English.",
    cta: "→ See full project cards in Projects",
    accent: {
      ring: "border-emerald-400/20",
      glow: "rgba(52,211,153,0.15)",
      text: "text-emerald-400",
      bg: "bg-emerald-400/[0.04]",
      bar: "from-emerald-500 to-emerald-400",
    },
    Demo: Eli5Card,
  },
  {
    id: "ghostwriter",
    title: "Smart Outreach",
    badge: "Auto · AI",
    desc: "Pick your persona, enter your name and need — AI writes a perfect, personalised outreach message you can copy and send.",
    cta: "→ Full form in Contact section",
    accent: {
      ring: "border-cyan-400/20",
      glow: "rgba(34,211,238,0.15)",
      text: "text-cyan-400",
      bg: "bg-cyan-400/[0.04]",
      bar: "from-cyan-500 to-cyan-400",
    },
    Demo: GhostwriterCard,
  },
] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const cardAnim = {
  hidden: { opacity: 0, y: 56, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 22, mass: 1.1 },
  },
};

export function AIFeaturesSection() {
  const ref            = useRef<HTMLDivElement>(null);
  const isInView       = useInView(ref, { once: true, amount: 0.1 });
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-zinc-950 py-20 sm:py-24">
      {/* Background ambience */}
      <div aria-hidden className="pointer-events-none absolute -left-48 -top-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.07),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.05),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div ref={ref} className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="mb-14 space-y-4"
          initial={prefersReduced ? false : { opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        >
          <SectionEyebrow>AI Integrations</SectionEyebrow>
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              Powered by AI
            </h2>
            {/* Live badge */}
            <span className="ai-badge">
              <span className="relative mr-0.5 inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
              </span>
              Live · AI
            </span>
            {/* Speed badge */}
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-1 text-[10px] font-semibold text-emerald-400 sm:inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
                <path fillRule="evenodd" d="M9.586 2.586A2 2 0 0 0 8.172 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.828a2 2 0 0 0-.586-1.414l-3.828-3.828ZM8 5a.75.75 0 0 1 .75.75v2.5h.75a.75.75 0 0 1 0 1.5h-.75v.75a.75.75 0 0 1-1.5 0v-.75H6.5a.75.75 0 0 1 0-1.5h.75v-2.5A.75.75 0 0 1 8 5Z" clipRule="evenodd" />
              </svg>
              ~300ms avg response
            </span>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
            Three live AI tools built into this portfolio — not just demos, but genuinely useful features you can try right now. Sub-300ms responses, real AI, works instantly.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={stagger}
          initial={prefersReduced ? false : "hidden"}
          animate={isInView ? "show" : "hidden"}
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.id}
              variants={cardAnim}
              className={`group relative flex flex-col gap-5 overflow-hidden rounded-2xl border ${card.accent.ring} ${card.accent.bg} p-5 backdrop-blur-sm`}
              whileHover={{
                y: -5,
                boxShadow: `0 20px 56px -10px ${card.accent.glow}`,
                transition: { type: "spring", stiffness: 340, damping: 24 },
              }}
            >
              {/* Animated top gradient line */}
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r ${card.accent.bar} opacity-40 group-hover:opacity-80 transition-opacity duration-500`} />

              {/* Subtle corner glow */}
              <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${card.accent.bar} opacity-0 blur-2xl group-hover:opacity-10 transition-opacity duration-700`} />

              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <h3 className={`text-sm font-bold ${card.accent.text}`}>{card.title}</h3>
                <span className={`shrink-0 rounded-full border ${card.accent.ring} ${card.accent.bg} px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${card.accent.text}`}>
                  {card.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed text-zinc-500">{card.desc}</p>

              {/* Demo */}
              <div className="flex-1 min-w-0">
                <card.Demo />
              </div>

              {/* Footer */}
              <p className={`text-[10px] font-semibold ${card.accent.text} opacity-50 group-hover:opacity-90 transition-opacity duration-300`}>
                {card.cta}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="mt-10 text-center text-xs text-zinc-700"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          All features degrade gracefully — smart fallbacks activate if the API key is missing.
        </motion.p>
      </div>
    </section>
  );
}
