import { ENDPOINTS } from "@/constants/endpoints";
import type { ContactFormValues } from "@/types/contact.types";
import { httpClient } from "@/api/http-client";

/**
 * Submits the contact form payload to the Next.js API route.
 */
export async function postContactMessage(
  payload: ContactFormValues,
): Promise<void> {
  await httpClient.post(ENDPOINTS.CONTACT, payload);
}
