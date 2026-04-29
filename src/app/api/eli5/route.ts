import { NextResponse } from "next/server";

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
}

export async function POST(request: Request) {
  try {
    const { markdown, projectName } = (await request.json()) as { markdown: string; projectName: string };

    if (!markdown) {
      return NextResponse.json({ ok: false, message: "Missing markdown" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        message: "AI simplification is currently offline (Missing API key).",
      });
    }

    const prompt = `You are an AI assistant that simplifies complex software architecture into "Explain Like I'm 5" (ELI5) or business-friendly language.

The following is the highly technical architecture markdown for a project named "${projectName}":

${markdown}

Your task:
Rewrite this architecture into a simplified, easy-to-understand version for non-technical founders, recruiters, or business clients. 
- Focus on the BUSINESS VALUE of the technology choices (e.g. "We used Redis" -> "We added a high-speed memory layer so your app loads instantly, preventing users from leaving").
- Avoid deep jargon, but keep it professional.
- Format the response as a few bullet points or short paragraphs.
- DO NOT use markdown headers (like ##), just use bolding (**) and standard bullet points (-) if needed.
- Keep it under 150 words.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json({ ok: false, message: "AI rate limit reached. Please wait a few seconds and try again." });
      }
      throw new Error(data.error?.message ?? `Groq status ${res.status}`);
    }

    const text = data.choices?.[0]?.message?.content?.trim() ?? "No response.";
    
    return NextResponse.json({ ok: true, message: text });
  } catch (error) {
    console.error("[eli5 api error]", error);
    return NextResponse.json(
      { ok: false, message: "Error generating simplified architecture." },
      { status: 500 }
    );
  }
}
