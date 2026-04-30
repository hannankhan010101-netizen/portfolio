"use client";

import { useReducedMotion } from "framer-motion";

const ROW_1 = [
  "Node.js", "Python", "FastAPI", "Fastify", "TypeScript", "PostgreSQL",
  "MySQL", "Redis", "Docker", "Supabase", "Stripe", "OpenAI", "Twilio", "SendGrid",
];
const ROW_2 = [
  "React", "Next.js", "Tailwind CSS", "REST APIs", "GraphQL", "WebSockets",
  "Prisma", "AWS", "CI/CD", "GitHub Actions", "Nginx", "QuickBooks", "ManyChat", "Calendly",
];

const DOT_COLORS = [
  "bg-cyan-400/70",
  "bg-emerald-400/70",
  "bg-violet-400/70",
  "bg-amber-400/70",
  "bg-rose-400/70",
];

function MarqueeRow({
  items,
  direction = "left",
  speed = 36,
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const doubled = [...items, ...items];
  const cls = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";

  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex shrink-0 gap-2.5 ${prefersReducedMotion ? "" : cls}`}
        style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
      >
        {doubled.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-zinc-400 transition-colors duration-200 hover:border-cyan-400/25 hover:text-zinc-200"
          >
            <span
              className={`h-[5px] w-[5px] shrink-0 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`}
            />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TechMarquee({
  className = "",
  fromBg = "zinc-950",
}: {
  className?: string;
  fromBg?: "zinc-950" | "zinc-900";
}) {
  const fade = fromBg === "zinc-900" ? "from-zinc-900" : "from-zinc-950";
  return (
    <div className={`relative overflow-hidden space-y-2.5 ${className}`}>
      {/* Edge fades */}
      <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r ${fade} to-transparent`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l ${fade} to-transparent`} />
      <MarqueeRow items={ROW_1} direction="left"  speed={38} />
      <MarqueeRow items={ROW_2} direction="right" speed={44} />
    </div>
  );
}
