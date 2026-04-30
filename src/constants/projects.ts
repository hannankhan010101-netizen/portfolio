import { PROJECT_CATEGORY_FILTER_KEYS } from "@/constants/project-categories";
import type { PortfolioProject } from "@/types/project.types";
import { GITHUB_PROFILE_URL } from "@/constants/personal";

const { ALL, BACKEND, API, ARCHITECTURE, CRM_SYSTEMS } = PROJECT_CATEGORY_FILTER_KEYS;

export const PROJECT_FILTER_OPTIONS: readonly {
  readonly key: (typeof PROJECT_CATEGORY_FILTER_KEYS)[keyof typeof PROJECT_CATEGORY_FILTER_KEYS];
  readonly label: string;
}[] = [
  { key: ALL, label: "All Projects" },
  { key: BACKEND, label: "Backend" },
  { key: API, label: "API" },
  { key: ARCHITECTURE, label: "Architecture" },
  { key: CRM_SYSTEMS, label: "CRM Systems" },
];

export const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = [
  {
    id: "befer-ai",
    name: "Befer AI",
    badgeLabel: "BACKEND",
    summary:
      "Business management platform built on 60+ modular backend services — supporting high-concurrency bookings, lead management, orders, payments, and OpenAI-driven marketing automation. Architected shared-memory infrastructure managing real-time synchronization between high-volume inbound/outbound AI voice streams.",
    techStack: ["Node.js", "Express", "MySQL", "Stripe", "QuickBooks", "OpenAI"],
    keyFeatures: [
      "60+ backend service modules: bookings, lead management, orders, and payments",
      "Shared-memory architecture for real-time AI voice stream synchronization",
      "Stripe and QuickBooks integrations for payments and accounting sync",
      "Google APIs for calendar, productivity, and OAuth authentication",
      "OpenAI-driven marketing automation workflows",
      "Complex relational schemas ensuring high availability in a high-concurrency environment",
    ],
    architectureMarkdown: `## Befer AI — system overview

### Scale
- **60+ service modules** organized as modular Express routers per business domain (bookings, billing, leads, marketing).
- **Shared-memory orchestration** managing real-time AI voice stream synchronization at high concurrency.

### Auth
- **Google OAuth** for user-facing flows; **JWT** for API access control across all routes.

### Integrations
- **Stripe** for subscription and transaction processing.
- **QuickBooks** for automated accounting synchronization.
- **Google APIs** for calendar scheduling and productivity surfaces.
- **OpenAI** for AI-driven engagement and marketing automation.

### Data
- Relational schemas designed for high availability and data consistency under concurrent booking load.`,
    githubUrl: GITHUB_PROFILE_URL,
    liveDemoUrl: "https://befer.co/",
    liveDemoLabel: "Live Demo",
    filterKeys: [BACKEND, API, ARCHITECTURE, CRM_SYSTEMS],
  },
  {
    id: "social-bear-ai",
    name: "Social Bear AI",
    badgeLabel: "BACKEND",
    summary:
      "High-throughput FastAPI backend for omnichannel social media automation — handling Instagram and Facebook messaging with sub-200ms latency. Engineered automated AI response systems and real-time moderation engines processing 1,000+ interactions per minute.",
    techStack: ["Python", "FastAPI", "Meta APIs", "OpenAI"],
    keyFeatures: [
      "Omnichannel Instagram and Facebook messaging with sub-200ms response latency",
      "Real-time moderation engine processing 1,000+ interactions per minute",
      "Automated AI-driven engagement and reply generation",
      "Async Meta webhook processing for live comment and DM events",
    ],
    architectureMarkdown: `## Social Bear AI — system overview

### Performance
- **FastAPI** async routes processing Meta webhooks at sub-200ms latency.
- **Real-time moderation** engine sustaining 1,000+ interactions per minute.

### Workers
- Async outbound reply workers with AI-generated content via OpenAI.
- Background moderation decision pipeline with event sourcing.

### Integrations
- **Meta Graph API** for Instagram and Facebook messaging and comment management.`,
    githubUrl: GITHUB_PROFILE_URL,
    liveDemoUrl: "https://socialguard.ai/login",
    liveDemoLabel: "Live Demo",
    filterKeys: [BACKEND, API],
  },
  {
    id: "broker-os-ai",
    name: "Broker-OS AI",
    badgeLabel: "ARCHITECTURE",
    summary:
      "Insurance sector workflow orchestration platform — automating high-stakes pipelines from initial lead ingestion to final CRM conversion. Event-driven automation engine reduced the lead-to-conversion window by 55%, eliminating manual procedural overhead across the full insurance brokerage lifecycle.",
    techStack: ["Node.js", "Fastify", "MySQL", "REST APIs"],
    keyFeatures: [
      "End-to-end lead ingestion to CRM conversion pipeline automation",
      "Event-driven architecture reducing lead-to-conversion window by 55%",
      "Workflow orchestration spanning document handling, compliance, and CRM sync",
      "High-stakes data integrity controls across a multi-step insurance brokerage lifecycle",
    ],
    architectureMarkdown: `## Broker-OS AI — system overview

### Workflow Engine
- **Event-driven orchestration** automating every stage from lead ingest through compliance to CRM conversion.
- **55% reduction** in lead-to-conversion window through automated procedural workflows.

### API Layer
- **Fastify** services with strict validation and audit logging at every state transition.
- **Idempotent webhooks** ensuring no duplicate processing across retried events.

### Data
- Relational schema modeling the full insurance brokerage lifecycle with immutable audit trails.
- **MySQL** with transactional guarantees on all high-stakes state changes.`,
    githubUrl: GITHUB_PROFILE_URL,
    liveDemoUrl: null,
    liveDemoLabel: "Live Demo",
    filterKeys: [BACKEND, ARCHITECTURE, CRM_SYSTEMS],
  },
  {
    id: "social-hub-ai",
    name: "Social Hub AI",
    badgeLabel: "BACKEND",
    summary:
      "Mass-scale email and SMS marketing automation platform optimized for 100k+ daily communications via Twilio and SendGrid. Orchestrated Stripo API integrations for dynamic content templating, with audience targeting and automated drip campaign workflows.",
    techStack: ["Node.js", "Express", "Twilio", "SendGrid", "Stripo"],
    keyFeatures: [
      "Optimized delivery pipeline for 100k+ daily email and SMS communications",
      "Stripo API integrations for dynamic email content and template management",
      "Audience segmentation, targeting, and automated drip campaign scheduling",
      "Twilio and SendGrid orchestration with delivery tracking and retry logic",
    ],
    architectureMarkdown: `## Social Hub AI — system overview

### Scale
- **100k+ daily communications** via Twilio (SMS) and SendGrid (email) with delivery optimization.
- **Stripo API** integration for dynamic, template-driven content pipelines.

### Services
- **Express** services for campaign CRUD, audience segmentation, and scheduling.
- **Schedulers** for drip sequences, broadcast windows, and SLA-based retries.

### Reliability
- Delivery tracking, bounce handling, and automated retry logic.`,
    githubUrl: GITHUB_PROFILE_URL,
    liveDemoUrl: null,
    liveDemoLabel: "Live Demo",
    filterKeys: [BACKEND, API],
  },
  {
    id: "leadly-ai",
    name: "Leadly AI",
    badgeLabel: "AI AUTOMATION",
    videoUrl: "/videos/leadly-demo.mp4",
    summary:
      "End-to-end real estate lead automation platform built on Bubble.io and Supabase. Captures inbound leads from ManyChat/WhatsApp, runs OpenAI sentiment analysis to score intent and buying readiness, then autonomously schedules and executes AI-powered discovery calls via VAPI — all without human intervention. Hot leads receive a personalised AI-generated property proposal within minutes of first contact.",
    techStack: ["Bubble.io", "Supabase", "ManyChat", "OpenAI", "VAPI", "Calendly"],
    keyFeatures: [
      "ManyChat webhook ingestion — captures WhatsApp & Instagram leads in real time",
      "OpenAI sentiment analysis — scores intent, urgency & buying readiness per message",
      "Autonomous AI call scheduling — qualifies leads and books calls without human input",
      "VAPI voice agent — conducts full AI discovery calls and logs structured outcomes",
      "AI proposal generation — personalised property decks auto-sent post-call",
      "End-to-end AI chatter — handles entire conversation from greeting to booked appointment",
    ],
    architectureMarkdown: `## Leadly AI — Real Estate Automation Architecture

### Lead Ingestion
- **ManyChat webhooks**: Captures WhatsApp/Instagram conversations and pushes structured lead data into Supabase via Bubble.io pipelines.
- **Conversation parsing**: Extracts intent, budget range, location preferences, and contact details from raw chat history.

### AI Intelligence Layer
- **Sentiment analysis**: OpenAI classifies each inbound message for buying intent, urgency, and readiness score (hot / warm / cold).
- **Lead scoring engine**: Score thresholds trigger different automation paths — hot leads go straight to AI calling, cold leads enter a nurture drip.

### AI Calling & Scheduling
- **VAPI voice agent**: Places autonomous AI discovery calls to qualified leads — conducts structured qualification, captures preferences, and logs call outcome back to Supabase.
- **Calendly integration**: Automatically books human-agent follow-ups for leads that complete a successful AI call.

### Proposal Engine
- **AI proposal generation**: OpenAI builds a personalised property recommendation deck based on the lead's profile, budget, and area preferences.
- **Auto-delivery**: Proposals dispatched via WhatsApp/email immediately after call completion — zero manual effort.

### Platform
- **Bubble.io**: Full agent dashboard UI and all integration workflow pipelines — no separate backend server required.
- **Supabase (PostgreSQL)**: Persistent store for leads, conversation logs, call recordings, proposal history, and analytics.`,
    githubUrl: GITHUB_PROFILE_URL,
    liveDemoUrl: null,
    liveDemoLabel: "Live Demo",
    filterKeys: [BACKEND, ARCHITECTURE, CRM_SYSTEMS],
  },
];

export const PROJECTS_SECTION_INTRO =
  "Production systems powering AI-driven B2B platforms — from 60-module marketplace backends and sub-200ms social automation engines to insurance workflow orchestrators that cut conversion windows by 55%.";

export const PROJECTS_PHILOSOPHY =
  "Every system I ship is built around three constants: reliability under concurrent load, maintainability at team scale, and security from day one. I treat backend architecture as a long-term strategic decision — modular, observable, and designed to grow without rewrites.";
