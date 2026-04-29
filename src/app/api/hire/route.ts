import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_LINKS } from "@/constants/personal";
import { RESEND_DEFAULT_FROM } from "@/constants/email-defaults";

export async function POST() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const to = process.env.CONTACT_TO_EMAIL ?? CONTACT_LINKS.email;
    const from = process.env.RESEND_FROM_EMAIL ?? RESEND_DEFAULT_FROM;

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Karachi",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await resend.emails.send({
      from,
      to: [to],
      subject: "[Portfolio] 🔥 New Hiring Interest",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #09090b; color: #fafafa; border-radius: 14px; border: 1px solid #27272a; overflow: hidden;">
          <div style="background: linear-gradient(135deg, rgba(34,211,238,0.12), rgba(52,211,153,0.06)); padding: 28px 28px 20px; border-bottom: 1px solid #27272a;">
            <p style="margin: 0 0 6px; font-size: 22px;">🔥</p>
            <h2 style="margin: 0; color: #22d3ee; font-size: 18px; font-weight: 700; letter-spacing: -0.01em;">New Hiring Interest</h2>
            <p style="margin: 6px 0 0; color: #71717a; font-size: 13px;">Someone clicked Hire Me on your portfolio</p>
          </div>
          <div style="padding: 24px 28px;">
            <p style="margin: 0 0 14px; color: #d4d4d8; font-size: 14px; line-height: 1.6;">
              A potential client or employer has expressed hiring interest by clicking the
              <strong style="color: #fafafa;"> Hire Me</strong> button on your portfolio.
            </p>
            <p style="margin: 0 0 20px; color: #d4d4d8; font-size: 14px; line-height: 1.6;">
              They have been directed to the contact form below the hero. Check back for their message or reach out proactively.
            </p>
            <div style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 14px 16px;">
              <p style="margin: 0; color: #52525b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Time (PKT)</p>
              <p style="margin: 4px 0 0; color: #a1a1aa; font-size: 13px;">${timestamp}</p>
            </div>
          </div>
          <div style="padding: 14px 28px 20px; border-top: 1px solid #18181b;">
            <p style="margin: 0; color: #3f3f46; font-size: 11px;">
              Automated notification from your portfolio · hannan.khan010101@gmail.com
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
