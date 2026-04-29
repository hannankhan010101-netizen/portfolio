import { NextResponse } from "next/server";
import { contactFormSchema } from "@/schemas/contact-schema";
import { sendContactNotification } from "@/server/email/send-contact-notification";
import type { ContactFormValues } from "@/types/contact.types";

/**
 * Validates the payload and sends an email to the portfolio owner via Resend.
 */
export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const values = (await contactFormSchema.validate(json, {
      abortEarly: false,
    })) as ContactFormValues;

    const result = await sendContactNotification(values);

    if (!result.ok) {
      const status = result.message.includes("RESEND_API_KEY") ? 503 : 502;

      return NextResponse.json(
        { ok: false, message: result.message },
        { status },
      );
    }

    return NextResponse.json(
      { ok: true, message: "Message sent." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid payload." },
      { status: 400 },
    );
  }
}
