import * as Yup from "yup";

/**
 * Yup validation schema for the contact form.
 */
export const contactFormSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name is too long")
    .required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email")
    .max(254, "Email is too long")
    .required("Email is required"),
  subject: Yup.string()
    .trim()
    .min(2, "Subject must be at least 2 characters")
    .max(200, "Subject is too long")
    .required("Subject is required"),
  message: Yup.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(8000, "Message is too long")
    .required("Message is required"),
});
