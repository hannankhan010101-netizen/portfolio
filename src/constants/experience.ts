import type { ExperienceEntry } from "@/types/experience.types";

export const EXPERIENCE_SECTION_INTRO =
  "From Backend Intern to Software Engineer II at Hatzs Dimensions — engineering production-grade APIs, securing distributed microservices, and shipping AI-driven B2B platforms that operate at 99.9% uptime.";

export const EXPERIENCE_ENTRIES: readonly ExperienceEntry[] = [
  {
    id: "software-engineer-ii",
    title: "Software Engineer II",
    company: "Hatzs Dimensions",
    dateRange: "Aug 2025 – Present",
    responsibilities: [
      "Architecting backend services and production-grade APIs using Node.js and MySQL, maintaining 99.9% uptime for AI-driven B2B platforms.",
      "Implementing high-security authentication systems — Google OAuth integrations and JWT authorization protocols across distributed microservices.",
      "Engineering and maintaining robust integration layers with Stripe payment platforms, Twilio/Meta messaging APIs, and external CRM architectures.",
      "Reduced deployment cycles by 35% through standardized CI/CD pipelines and containerized staging environments utilizing Docker.",
    ],
    technologies: [
      "Node.js",
      "MySQL",
      "Google OAuth",
      "JWT",
      "Stripe",
      "Twilio",
      "Meta APIs",
      "Docker",
      "CI/CD",
    ],
  },
  {
    id: "backend-intern",
    title: "Backend Intern",
    company: "Hatzs Dimensions",
    dateRange: "Jun 2025 – Aug 2025",
    responsibilities: [
      "Supported backend development for Befer AI, contributing to high-volume booking engines, lead generation modules, and automated payment systems.",
      "Developed backend modules for automated reminders, media handling, and bidirectional scheduling synchronization with Google Calendar.",
    ],
    technologies: [
      "Node.js",
      "MySQL",
      "Stripe",
      "Google Calendar API",
      "REST APIs",
    ],
  },
];
