import { NextResponse } from "next/server";
import { generateContactMessage } from "@/utils/message-generator";

interface GenerateContext {
  name: string;
  subject: string;
  role?: string;
  intent?: string;
  brief?: string;
}

async function generateWithGroq(
  apiKey: string,
  ctx: GenerateContext,
): Promise<string> {
  const contextLines = [
    ctx.name ? `Sender's name: ${ctx.name}` : null,
    ctx.role ? `Sender's role / position: ${ctx.role}` : null,
    ctx.intent ? `What they're looking for: ${ctx.intent}` : null,
    ctx.subject ? `Subject / purpose: ${ctx.subject}` : null,
    ctx.brief ? `Additional context: ${ctx.brief}` : null,
    !ctx.subject && !ctx.intent
      ? "Interested in discussing a project or hiring opportunity."
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `You are ghostwriting a short, human-sounding outreach message from someone contacting Hannan Ahmed Khan about a potential opportunity.

About Hannan:
- Software Engineer II at Hatzs Dimensions, Lahore, Pakistan
- Specialises in multi-tenant CRM platforms, AI-driven B2B automation, and high-integration backend systems
- Tech stack: Node.js, Python (FastAPI), MySQL, Redis, Docker, Stripe, OpenAI, Meta APIs
- Key achievements: 99.9% platform uptime, 60+ backend modules shipped, +200% conversion boost, −55% lead conversion window, 1,000+ interactions/min, 100k+ daily communications

Sender context:
${contextLines}

Write ONLY the message body (3–5 sentences). Strict rules:
- Ensure the message heavily integrates the details from the sender's brief, stated intent, and role context. Address their specific requirements, project ideas, or business context directly.
- Sound like a real human wrote it — no corporate boilerplate, no robotic phrasing.
- NEVER insert the sender's role or job title literally into the message (e.g. do NOT write "as Entrepreneur" or "as CTO"). Use it only to shape tone and perspective.
- NEVER quote or paraphrase the brief verbatim. Transform the brief into natural conversational requirements: "want to built a system that checks appointments" → "building an automated appointment management platform for dental clinics".
- Infer the real intent from the brief even if the stated category is "General Inquiry".
- Tie 1–2 of Hannan's specific skills or achievements to how it solves the sender's actual needs mentioned in the brief.
- End by explicitly asking to schedule a meeting or book a call — use natural phrasing like "I'd love to schedule a meeting", "could we book a call", or "let me know when you're free and I'll send a calendar invite".
- Start with a warm, natural greeting like "Hi Hannan," or "Hello Hannan," on its own line before the message body.
- No sign-off, no name placeholders.
- Plain text only.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
      temperature: 0.75,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("AI is currently cooling down due to rate limits. Please try again in 15 seconds.");
    }
    throw new Error(data.error?.message ?? `Groq responded with status ${res.status}`);
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned an empty response.");
  return text;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    subject?: string;
    role?: string;
    intent?: string;
    brief?: string;
  };

  const ctx: GenerateContext = {
    name: body.name ?? "",
    subject: body.subject ?? "",
    role: body.role ?? "",
    intent: body.intent ?? "",
    brief: body.brief ?? "",
  };

  const apiKey = process.env.GROQ_API_KEY;

  if (apiKey) {
    try {
      const message = await generateWithGroq(apiKey, ctx);
      return NextResponse.json({ ok: true, message });
    } catch (err) {
      console.error("[generate-message] Groq error:", (err as Error).message);
    }
  }

  const message = generateContactMessage(ctx);
  return NextResponse.json({ ok: true, message });
}
