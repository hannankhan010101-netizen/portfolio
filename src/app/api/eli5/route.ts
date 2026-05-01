import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { markdown, projectName } = (await request.json()) as { markdown: string; projectName: string };

    if (!markdown?.trim()) {
      return NextResponse.json({ ok: false, message: "Nothing to translate." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        message: "Think of it like this: instead of building everything from scratch each time, this system uses pre-built, battle-tested components that talk to each other — like Lego bricks instead of raw clay. The result is a platform that scales as you grow, doesn't go down when traffic spikes, and connects to the tools you already use (payments, email, CRMs) without custom glue code.",
      });
    }

    const prompt = `You're explaining the technology behind "${projectName}" to a smart non-technical business person — a founder, investor, or client who cares about outcomes, not implementation details.

Technical stack:
${markdown}

Write 2–3 short paragraphs in plain English. Rules:
- Never use technical jargon (no Redis, Docker, JWT, API, OAuth, async, etc.)
- Translate every technical choice into a business outcome: "Redis" → "lightning-fast data layer that keeps your app snappy even under heavy load"
- Be specific about the real-world benefit: speed, reliability, cost, user experience, security
- Sound like a knowledgeable advisor, not a marketing brochure — honest and direct
- No bullet points, no headers, no bold text. Just natural flowing paragraphs.
- Under 120 words total.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 220,
        temperature: 0.72,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json({
          ok: false,
          message: "Getting a lot of requests right now — wait a few seconds and try again.",
        });
      }
      throw new Error(data.error?.message ?? `Groq responded with status ${res.status}`);
    }

    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Empty response from model.");

    return NextResponse.json({ ok: true, message: text });
  } catch (error) {
    console.error("[eli5]", error);
    return NextResponse.json(
      { ok: false, message: "Couldn't simplify this one — give it another try." },
      { status: 500 },
    );
  }
}
