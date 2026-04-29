import type {
  AboutHighlight,
  AboutSpecialization,
  ContactLinks,
  EducationEntry,
} from "@/types/personal.types";

export const CONTACT_LINKS: ContactLinks = {
  email: "hannan.khan010101@gmail.com",
  phoneDisplay: "+92 302 464 4739",
  phoneTel: "+923024644739",
  linkedInUrl: "https://www.linkedin.com/in/hannan-ahmed-khan",
  linkedInDisplay: "hannan-ahmed-khan",
  gitHubUrl: "https://github.com/hannanAhmedKhanHatzs",
  gitHubDisplay: "hannanAhmedKhanHatzs",
};

export const GITHUB_PROFILE_URL = CONTACT_LINKS.gitHubUrl;

export const PERSON_FULL_NAME = "Hannan Ahmed Khan";

export const PERSON_PRIMARY_ROLE = "Software Engineer II";

export const HERO_INTRO_PARAGRAPH =
  "Architecting multi-tenant CRM platforms, automated B2B ecosystems, and high-integration backend infrastructures at production scale. Specialist in scalable API design and workflow engines — with 60+ service modules shipped, 99.9% uptime maintained, and deployment cycles accelerated by 35% through containerized CI/CD.";

export const ABOUT_PROFESSIONAL_SUMMARY =
  "Backend Software Engineer II specializing in architecting multi-tenant CRM platforms, automated B2B ecosystems, and high-integration backend systems. Expert in designing scalable APIs and workflow engines using Node.js, Python (FastAPI), and Supabase — with production integrations spanning Stripe, QuickBooks, TikTok API, Meta APIs, Google Business Profile, Twilio, and OpenAI.\n\nProven track record of translating complex enterprise requirements into production-grade systems through rapid development cycles and AI-assisted engineering workflows. Reduced deployment cycles by 35% via containerized CI/CD pipelines, engineered automation that cut lead-to-conversion windows by 55%, and architected backends sustaining 99.9% uptime for AI-driven B2B platforms processing high-volume real-time voice and data streams.\n\nPrimary on-call engineer for mission-critical systems and technical SME in client discovery sessions — bridging backend architecture with stakeholder requirements to deliver scalable, reliable infrastructure.";

export const EDUCATION: EducationEntry = {
  degree: "BS in Computer Science",
  institution: "The Superior University, Lahore",
};

export const ABOUT_SPECIALIZATIONS: readonly AboutSpecialization[] = [
  {
    id: "multi-tenant-crm",
    title: "Multi-Tenant CRM Platforms",
    description:
      "Architecting organization-scoped data models, role-based access control, and workflow engines powering AI-driven B2B platforms at enterprise scale.",
  },
  {
    id: "ai-automation",
    title: "AI-Driven Automation",
    description:
      "Engineering OpenAI-powered lead engagement, automated response systems, and real-time moderation engines capable of processing 1,000+ interactions per minute.",
  },
  {
    id: "enterprise-integration",
    title: "Enterprise Integration Layer",
    description:
      "Building production-grade integration architectures with Stripe, QuickBooks, TikTok API, Meta APIs, Google Business Profile, Twilio/SendGrid, and Calendly.",
  },
  {
    id: "workflow-orchestration",
    title: "Workflow Orchestration",
    description:
      "Designing event-driven automation engines for insurance, real estate, and marketing sectors — eliminating procedural overhead and accelerating business outcomes by up to 55%.",
  },
];

export const ABOUT_HIGHLIGHTS: readonly AboutHighlight[] = [
  {
    id: "h1",
    text: "Mentored backend interns through successful transitions to full-time engineering roles, fostering excellence through rigorous code reviews and documentation standards.",
  },
  {
    id: "h2",
    text: "Led technical discovery sessions with enterprise clients, translating complex business requirements into actionable system architectures and delivery roadmaps.",
  },
  {
    id: "h3",
    text: "Primary on-call engineer for mission-critical systems — conducting root-cause analysis and proactive system health monitoring to maintain 99.9% uptime.",
  },
  {
    id: "h4",
    text: "Bridged technical gaps between product managers and stakeholders, ensuring seamless feature delivery and cross-functional alignment across every sprint.",
  },
];

export const SYSTEM_ARCHITECTURE_PILLARS = [
  {
    id: "scalability",
    title: "Scalability",
    description:
      "Shared-memory architectures, horizontal scaling patterns, and queue-backed workloads engineered to sustain high-volume real-time voice and data streams.",
  },
  {
    id: "security",
    title: "Security",
    description:
      "High-security AuthN/AuthZ, JWT/OAuth protocols across distributed microservices, secrets hygiene, and safe handling of customer and payment data.",
  },
  {
    id: "performance",
    title: "Performance",
    description:
      "Query profiling, Redis caching strategies, and full-stack observability via Sentry to keep latency predictable under production load.",
  },
] as const;

export const BACKEND_PHILOSOPHY_PARAGRAPH =
  "I build backend systems the way enterprise infrastructure demands: reliable, maintainable, and architected to scale. Combining clean code, production-grade security, and thoughtful multi-tenant design — I deliver solutions that teams trust with their most critical workloads. Tech-stack agnostic with production experience across Node.js, Python, Supabase, and Docker.";
