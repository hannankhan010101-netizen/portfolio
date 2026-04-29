"use client";

import { Form, Formik } from "formik";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { contactFormSchema } from "@/schemas/contact-schema";
import { CONTACT_FORM_INITIAL_VALUES } from "@/constants/contact-form";
import { CONTACT_SECTION } from "@/constants/contact";
import { useContactSubmission } from "@/hooks/contact/use-contact-submission";
import type { ContactFormValues } from "@/types/contact.types";
import { isAxiosError } from "axios";

const INTENT_OPTIONS = [
  { value: "", label: "What are you looking for?" },
  { value: "Hire full-time", label: "Hire Full-time" },
  { value: "Freelance / contract project", label: "Freelance / Contract" },
  { value: "Technical consultation", label: "Technical Consultation" },
  { value: "Partnership / collaboration", label: "Partnership / Collaboration" },
  { value: "General inquiry", label: "General Inquiry" },
] as const;

interface AiContext {
  role: string;
  intent: string;
  brief: string;
}

async function fetchGeneratedMessage(
  name: string,
  subject: string,
  ai: AiContext,
): Promise<string> {
  const res = await fetch("/api/generate-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, subject, ...ai }),
  });
  const data = (await res.json()) as { ok: boolean; message: string };
  if (!data.ok) throw new Error(data.message);
  return data.message;
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-cyan-500/40 transition-colors focus:border-cyan-500/40 focus:ring-2";

export function ContactForm() {
  const submission = useContactSubmission();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [aiContext, setAiContext] = useState<AiContext>({
    role: "",
    intent: "",
    brief: "",
  });

  return (
    <Formik<ContactFormValues>
      initialValues={CONTACT_FORM_INITIAL_VALUES}
      validationSchema={contactFormSchema}
      validateOnMount={false}
      onSubmit={async (values, helpers) => {
        try {
          await submission.mutateAsync(values);
          helpers.resetForm();
        } catch {
          /* surfaced via submission.error */
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isSubmitting, getFieldProps, setFieldValue, values }) => (
        <Form className="space-y-4">

          {/* Name */}
          <div>
            <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-zinc-300">
              {CONTACT_SECTION.fieldNameLabel}
            </label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              className={inputClass}
              {...getFieldProps("name")}
            />
            {touched.name && errors.name ? (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            ) : null}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-zinc-300">
              {CONTACT_SECTION.fieldEmailLabel}
            </label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              className={inputClass}
              {...getFieldProps("email")}
            />
            {touched.email && errors.email ? (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            ) : null}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium text-zinc-300">
              {CONTACT_SECTION.fieldSubjectLabel}
            </label>
            <input
              id="contact-subject"
              type="text"
              autoComplete="off"
              className={inputClass}
              {...getFieldProps("subject")}
            />
            {touched.subject && errors.subject ? (
              <p className="mt-1 text-xs text-red-400">{errors.subject}</p>
            ) : null}
          </div>

          {/* ── AI Context Panel ───────────────────────────────────────── */}
          <div className="rounded-xl border border-violet-400/20 bg-violet-400/[0.04] p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-violet-400 text-xs">✦</span>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">
                AI Context
              </p>
              <span className="text-[10px] text-zinc-600 normal-case tracking-normal">
                — helps generate a better message
              </span>
            </div>

            {/* Row 1: Role + Intent */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="ai-role"
                  className="mb-1 block text-xs font-medium text-zinc-400"
                >
                  Your Role / Position
                </label>
                <input
                  id="ai-role"
                  type="text"
                  placeholder="e.g. CTO, Founder, HR Manager"
                  value={aiContext.role}
                  onChange={(e) =>
                    setAiContext((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 outline-none ring-violet-500/30 transition-colors focus:border-violet-400/40 focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="ai-intent"
                  className="mb-1 block text-xs font-medium text-zinc-400"
                >
                  Looking for
                </label>
                <select
                  id="ai-intent"
                  value={aiContext.intent}
                  onChange={(e) =>
                    setAiContext((prev) => ({ ...prev, intent: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 outline-none ring-violet-500/30 transition-colors focus:border-violet-400/40 focus:ring-2"
                >
                  {INTENT_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.value === ""}
                      className="bg-zinc-900 text-zinc-100"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Brief */}
            <div>
              <label
                htmlFor="ai-brief"
                className="mb-1 block text-xs font-medium text-zinc-400"
              >
                Brief description{" "}
                <span className="text-zinc-600">(optional)</span>
              </label>
              <input
                id="ai-brief"
                type="text"
                placeholder="e.g. Need a backend engineer for a 3-month SaaS project with Stripe integration"
                value={aiContext.brief}
                onChange={(e) =>
                  setAiContext((prev) => ({ ...prev, brief: e.target.value }))
                }
                className="w-full rounded-lg border border-white/[0.08] bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 outline-none ring-violet-500/30 transition-colors focus:border-violet-400/40 focus:ring-2"
              />
            </div>
          </div>

          {/* Message + Generate button */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label htmlFor="contact-message" className="text-sm font-medium text-zinc-300">
                {CONTACT_SECTION.fieldMessageLabel}
              </label>

              <motion.button
                type="button"
                disabled={isGenerating}
                onClick={async () => {
                  setGenerateError(null);
                  setIsGenerating(true);
                  try {
                    const text = await fetchGeneratedMessage(
                      values.name,
                      values.subject,
                      aiContext,
                    );
                    await setFieldValue("message", text);
                  } catch (err) {
                    setGenerateError(
                      err instanceof Error ? err.message : "Generation failed. Try again.",
                    );
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-400/[0.07] px-3 py-1 text-[11px] font-semibold text-violet-300 transition-colors hover:border-violet-400/50 hover:bg-violet-400/[0.12] disabled:cursor-not-allowed disabled:opacity-55"
                whileHover={isGenerating ? undefined : { scale: 1.04 }}
                whileTap={isGenerating ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isGenerating ? (
                    <motion.span
                      key="generating"
                      className="flex items-center gap-1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <svg
                        className="h-3 w-3 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Generating…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      className="flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      ✦ Generate with AI
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            <div className="relative">
              <textarea
                id="contact-message"
                rows={5}
                className={inputClass}
                {...getFieldProps("message")}
              />
              <AnimatePresence>
                {isGenerating ? (
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-lg border border-violet-400/35 bg-violet-400/[0.03]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                ) : null}
              </AnimatePresence>
            </div>

            {touched.message && errors.message ? (
              <p className="mt-1 text-xs text-red-400">{errors.message}</p>
            ) : null}
            {generateError ? (
              <p className="mt-1 text-xs text-red-400">{generateError}</p>
            ) : null}
          </div>

          {/* Submission state */}
          {submission.isError ? (
            <p className="text-sm text-red-400">
              {isAxiosError(submission.error)
                ? submission.error.message
                : "Something went wrong. Please try again."}
            </p>
          ) : null}
          {submission.isSuccess ? (
            <p className="text-sm text-emerald-400">{CONTACT_SECTION.successMessage}</p>
          ) : null}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting || submission.isPending}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_28px_-6px_rgba(34,211,238,0.45)] transition hover:from-cyan-400 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            whileHover={
              isSubmitting || submission.isPending
                ? undefined
                : { scale: 1.02, boxShadow: "0 0 36px -4px rgba(34,211,238,0.55)" }
            }
            whileTap={isSubmitting || submission.isPending ? undefined : { scale: 0.98 }}
          >
            {submission.isPending || isSubmitting
              ? CONTACT_SECTION.sendingLabel
              : CONTACT_SECTION.submitLabel}
          </motion.button>

        </Form>
      )}
    </Formik>
  );
}
