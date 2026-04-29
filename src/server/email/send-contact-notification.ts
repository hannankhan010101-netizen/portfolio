import { Resend } from "resend";
import { CONTACT_LINKS } from "@/constants/personal";
import { RESEND_DEFAULT_FROM } from "@/constants/email-defaults";
import { escapeHtml } from "@/utils/email/escape-html";
import type { ContactFormValues } from "@/types/contact.types";

export interface SendContactNotificationResult {
  readonly ok: true;
}

export interface SendContactNotificationError {
  readonly ok: false;
  readonly message: string;
}

/**
 * Sends the portfolio contact form to the owner inbox via Resend.
 */
export async function sendContactNotification(
  values: ContactFormValues,
): Promise<SendContactNotificationResult | SendContactNotificationError> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      message:
        "Email is not configured. Set RESEND_API_KEY on the server (see .env.example).",
    };
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL ?? CONTACT_LINKS.email;
  const from = process.env.RESEND_FROM_EMAIL ?? RESEND_DEFAULT_FROM;

  const safeName = escapeHtml(values.name);
  const safeEmail = escapeHtml(values.email);
  const safeSubject = escapeHtml(values.subject);
  const safeMessage = escapeHtml(values.message).replace(/\n/g, "<br />");

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: values.email,
    subject: `[Portfolio] ${values.subject}`,
    html: `
      <p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
      <p><strong>Subject:</strong> ${safeSubject}</p>
      <hr />
      <p>${safeMessage}</p>
    `,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true };
}
