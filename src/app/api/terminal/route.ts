import { NextResponse } from "next/server";

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
}

export async function POST(request: Request) {
  try {
    const { command } = (await request.json()) as { command: string };

    if (!command || typeof command !== "string") {
      return NextResponse.json({ ok: false, message: "Invalid command" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      // Fallback response if no API key is configured
      return NextResponse.json({
        ok: true,
        message: "Terminal AI is offline (Missing GROQ_API_KEY).\nCommand received: " + command,
      });
    }

    const prompt = `You are a helpful, CLI-based AI assistant integrated into Hannan Ahmed Khan's portfolio website.
The user just typed this command into the terminal: "${command}"

About Hannan:
- Software Engineer II at Hatzs Dimensions, Lahore, Pakistan.
- Specializes in backend systems, AI automation, Node.js, Python (FastAPI), MySQL, Redis.
- Key achievements: 99.9% uptime, 60+ modules shipped.

Instructions:
- Respond as if you are a terminal output. Keep it concise, tech-savvy, and formatting like a CLI response.
- Do NOT use markdown code blocks like \`\`\`bash or \`\`\` around your entire response.
- Use plain text. You can use multiple lines.
- If they ask for help, list a few example commands they can try like "whoami", "skills", "projects", "contact".
- If the command doesn't make sense, respond with a typical CLI error like "command not found: [command]" but then suggest they ask a question.
- Always highlight Hannan's skills positively.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json({ ok: false, message: "AI is cooling down (rate limit). Please wait a few seconds and try again." });
      }
      throw new Error(data.error?.message ?? `Groq status ${res.status}`);
    }

    const text = data.choices?.[0]?.message?.content?.trim() ?? "No response.";
    
    return NextResponse.json({ ok: true, message: text });
  } catch (error) {
    console.error("[terminal api error]", error);
    return NextResponse.json(
      { ok: false, message: "Error processing command. System overloaded." },
      { status: 500 }
    );
  }
}
