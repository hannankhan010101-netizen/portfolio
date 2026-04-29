import { useMutation } from "@tanstack/react-query";
import { postContactMessage } from "@/api/contact.service";
import type { ContactFormValues } from "@/types/contact.types";

/**
 * Mutation hook for submitting the contact form via the API route.
 */
export function useContactSubmission() {
  return useMutation({
    mutationKey: ["contact", "submit"],
    mutationFn: (values: ContactFormValues) => postContactMessage(values),
  });
}
