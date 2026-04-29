import type { ContactFormValues } from "@/types/contact.types";

/**
 * Default empty state for the contact form.
 */
export const CONTACT_FORM_INITIAL_VALUES: ContactFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};
