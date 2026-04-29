import type { ContactFormValues } from "@/types/contact.types";
import { CONTACT_LINKS } from "@/constants/personal";

/**
 * Builds a mailto URL for client-side contact submission when no HTTP API is used.
 */
export function buildContactMailto(values: ContactFormValues): string {
  const params = new URLSearchParams({
    subject: values.subject,
    body: `From: ${values.name} <${values.email}>\n\n${values.message}`,
  });

  return `mailto:${CONTACT_LINKS.email}?${params.toString()}`;
}
