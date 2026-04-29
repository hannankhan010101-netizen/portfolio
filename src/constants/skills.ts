import type { SkillBarGroup, SkillExpertiseCard } from "@/types/skills.types";

export const CORE_STACK_TECHS = [
  "Node.js",
  "TypeScript",
  "Python / FastAPI",
  "MySQL",
  "Redis",
  "Docker",
  "Stripe",
  "OpenAI API",
] as const;

export const SKILLS_SECTION_INTRO =
  "Full-stack backend competency across Node.js, Python, and SQL — with production-grade integrations spanning payment processors, social APIs, AI platforms, and enterprise CRM systems.";

export const SKILL_BAR_GROUPS: readonly SkillBarGroup[] = [
  {
    id: "languages",
    title: "Languages",
    items: [
      { id: "js", label: "JavaScript", percent: 95 },
      { id: "ts", label: "TypeScript", percent: 90 },
      { id: "py", label: "Python", percent: 85 },
      { id: "sql", label: "SQL", percent: 90 },
    ],
  },
  {
    id: "backend-apis",
    title: "Backend & APIs",
    items: [
      { id: "node", label: "Node.js", percent: 95 },
      { id: "fastify", label: "Fastify", percent: 90 },
      { id: "express", label: "Express.js", percent: 92 },
      { id: "fastapi", label: "FastAPI", percent: 85 },
      { id: "rest", label: "REST APIs", percent: 95 },
      { id: "ws", label: "WebSockets", percent: 85 },
      { id: "jwt", label: "JWT & OAuth", percent: 92 },
      { id: "supabase", label: "Supabase", percent: 80 },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    items: [
      { id: "mysql", label: "MySQL", percent: 92 },
      { id: "mongo", label: "MongoDB", percent: 80 },
      { id: "redis", label: "Redis", percent: 85 },
      { id: "pg", label: "PostgreSQL", percent: 78 },
    ],
  },
  {
    id: "integrations-tools",
    title: "Integrations & Tools",
    items: [
      { id: "stripe", label: "Stripe", percent: 90 },
      { id: "quickbooks", label: "QuickBooks", percent: 78 },
      { id: "twilio", label: "Twilio / SendGrid", percent: 88 },
      { id: "meta", label: "Meta / TikTok APIs", percent: 85 },
      { id: "openai", label: "OpenAI API", percent: 85 },
      { id: "docker", label: "Docker", percent: 82 },
      { id: "git", label: "Git & GitHub", percent: 95 },
      { id: "sentry", label: "Sentry & Monitoring", percent: 80 },
    ],
  },
];

export const SKILL_EXPERTISE_CARDS: readonly SkillExpertiseCard[] = [
  {
    id: "api-design",
    title: "API Design & Architecture",
    description:
      "Architecting production-grade RESTful APIs with strict validation, comprehensive error handling, rate limiting, and JWT/OAuth security — deployed at 99.9% uptime.",
  },
  {
    id: "db-optimization",
    title: "Database Optimization",
    description:
      "Designing complex relational schemas ensuring high availability and data consistency within high-concurrency environments, backed by Redis caching and query profiling.",
  },
  {
    id: "auth-systems",
    title: "Authentication Systems",
    description:
      "Implementing high-security authentication including Google OAuth integrations and JWT authorization protocols across distributed microservices architectures.",
  },
  {
    id: "payments",
    title: "Payment & Billing Systems",
    description:
      "Engineering Stripe payment architectures, QuickBooks accounting sync, subscription lifecycle management, and idempotent transaction handling at scale.",
  },
  {
    id: "multi-tenant",
    title: "Multi-Tenant & RBAC",
    description:
      "Architecting organization-scoped data models, role-based access control, audit trails, and event-driven workflow engines for enterprise B2B platforms.",
  },
  {
    id: "performance",
    title: "System Performance",
    description:
      "Reducing deployment cycles by 35% through Docker-based CI/CD, optimizing query performance, and implementing shared-memory architectures for real-time AI stream synchronization.",
  },
];
