interface MessageContext {
  name: string;
  subject: string;
  role?: string;
  intent?: string;
  brief?: string;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const GENERIC_INTENTS = new Set(["general inquiry", "general", ""]);

function detectIntent(subject: string, explicitIntent?: string, brief?: string) {
  if (explicitIntent && !GENERIC_INTENTS.has(explicitIntent.toLowerCase())) {
    const i = explicitIntent.toLowerCase();
    return {
      isHiring: i.includes("hire") || i.includes("full-time") || i.includes("full time"),
      isProject: i.includes("freelance") || i.includes("contract"),
      isConsultation: i.includes("consult"),
      isCollaboration: i.includes("partner") || i.includes("collab"),
    };
  }
  const combined = `${subject} ${brief ?? ""}`.toLowerCase();
  return {
    isHiring: /hire|job|position|role|opportunit|employ|recruit|full.?time|part.?time|career|opening/i.test(combined),
    isProject: /project|build|develop|creat|freelanc|contract|platform|app|system|product|automat|integrat|tool|dashboard|workflow|bot|api/i.test(combined),
    isConsultation: /consult|advice|review|audit|help|strateg|architect/i.test(combined),
    isCollaboration: /collab|partner|team|together|joint|co-found/i.test(combined),
  };
}

// Strips leading "want to build / need to create / looking to develop" so it
// doesn't double-up when embedded in a sentence ("I'm looking to want to build…")
function normalizeBrief(raw: string): string {
  return raw
    .trim()
    .replace(/^(i\s+)?(want|need|would like|am looking|looking)\s+(to\s+)?/i, "")
    .replace(/^(build|create|develop|make)\s+/i, "building ")
    .replace(/[.!?]+$/, "")
    .trim();
}

function briefMiddle(brief: string): string {
  const b = normalizeBrief(brief);
  const lower = b.charAt(0).toLowerCase() + b.slice(1);
  return pick([
    `I'm working on ${lower} — and given your experience shipping high-integration backend systems that handle 1,000+ interactions per minute, I think you're exactly the engineer to make this reliable and production-ready.`,
    `The project is ${lower}. Your track record of building AI-driven workflow automation at scale, paired with your deep integration experience across Stripe, OpenAI, and Meta APIs, makes you the right fit for what we need.`,
    `What I'm building is ${lower}, and the complexity of the integration layer is exactly where your expertise stands out — particularly your work delivering 60+ backend modules with 99.9% uptime.`,
  ]);
}

export function generateContactMessage({ name, subject, role, intent, brief }: MessageContext): string {
  const intro = name.trim() ? `My name is ${name.trim()} and I` : "I";
  const detectedIntent = detectIntent(subject, intent, brief);

  // Role shapes tone context only — never inserted literally into sentences
  const roleContext = role?.trim().toLowerCase() ?? "";
  const isFounder = /founder|entrepreneur|ceo|co-founder/i.test(roleContext);
  const isTechnical = /cto|engineer|developer|architect|tech/i.test(roleContext);

  const openings = isFounder
    ? [
        `${intro} came across your portfolio while looking for a backend engineer who can move fast without breaking things — your 35% reduction in deployment cycles and 99.9% uptime record immediately stood out.`,
        `${intro} reviewed your portfolio and the way you've consistently delivered measurable outcomes — 55% faster lead conversion, 60+ production modules, AI-driven automation at scale — is exactly the execution speed I need.`,
      ]
    : isTechnical
    ? [
        `${intro} came across your portfolio and was impressed by the depth of your backend architecture work — multi-tenant systems, real-time API design, and the Docker CI/CD pipelines you've shipped at Hatzs Dimensions.`,
        `${intro} reviewed your portfolio and your engineering approach stands out — particularly the workflow orchestration systems and the scale at which you've handled integrations across Stripe, OpenAI, and Meta APIs.`,
      ]
    : [
        `${intro} came across your portfolio and was immediately struck by the outcomes you've delivered — 99.9% platform uptime, a 55% reduction in lead conversion windows, and 60+ backend modules shipped across AI-driven B2B platforms.`,
        `${intro} reviewed your portfolio and your background in multi-tenant CRM platforms and high-integration backend systems is exactly what I've been looking for.`,
        `After going through your portfolio, the combination of technical depth and measurable business impact is rare — reducing deployment cycles by 35% while maintaining 99.9% uptime tells me you understand both engineering and delivery.`,
      ];

  let middle: string;

  if (detectedIntent.isHiring) {
    middle = pick([
      `We're scaling our engineering team and need someone who can own backend architecture end-to-end — from system design through production deployment. Your experience with Docker CI/CD, multi-tenant data models, and enterprise API integrations is exactly what we're looking to bring on.`,
      `We need a backend engineer who can handle the full complexity of our platform — scalable APIs, workflow automation, and third-party integrations with systems like Stripe and OpenAI. Your portfolio shows you've done this before at production scale.`,
    ]);
  } else if (detectedIntent.isProject) {
    middle = brief ? briefMiddle(brief) : pick([
      `I have a project that requires scalable API design, real-time workflow automation, and third-party integrations. Your hands-on experience shipping production-grade backends — including systems processing 100k+ daily communications — makes you the right engineer for this.`,
      `The project involves complex backend architecture and deep integrations, and based on your work on Befer AI and Leadly AI, you've already solved the hardest parts of what I need to build.`,
    ]);
  } else if (detectedIntent.isConsultation) {
    middle = pick([
      `I'm looking for an expert to review our backend architecture — specifically around scalability, API design, and integration reliability. Your systems thinking and production track record would bring exactly the clarity we need.`,
      `We need a technical perspective on our current backend stack — database design, API structure, and third-party integration strategy. Your depth in Node.js distributed systems is what this audit calls for.`,
    ]);
  } else if (detectedIntent.isCollaboration) {
    middle = pick([
      `I'm exploring a collaboration and your backend systems expertise would complement what we're building. The AI-driven automation and enterprise integration work in your portfolio is directly relevant to the direction we're heading.`,
      `We're assembling a technical team for an ambitious build and your profile — CRM platforms, payment systems, real-time APIs — is the foundation we need.`,
    ]);
  } else {
    middle = brief
      ? briefMiddle(brief)
      : pick([
          `Your expertise across workflow orchestration, multi-tenant systems, and production-scale API design is directly relevant to what I have in mind. The consistent delivery of measurable results across every project tells me you're someone who takes real ownership.`,
          `The technical depth you've demonstrated — from real-time AI voice stream synchronization to 100k+ daily communication pipelines — is exactly the kind of senior engineering thinking this project needs.`,
        ]);
  }

  const closings = [
    `Would you be open to scheduling a meeting this week? Even 20 minutes would be enough to see if there's a strong fit — I'm happy to work around your availability.`,
    `I'd love to schedule a call to walk through the details. Please let me know a time that works for you and I'll send a calendar invite right away.`,
    `Could we book a short meeting to discuss this further? I'm flexible on timing — just share your availability and I'll get it on the calendar.`,
    `If you're open to it, I'd like to schedule a meeting to explore this properly. Let me know your preferred time or share a calendar link and I'll confirm immediately.`,
  ];

  const greetings = ["Hi Hannan,", "Hello Hannan,", "Hey Hannan,"];

  return `${pick(greetings)}\n\n${pick(openings)} ${middle} ${pick(closings)}`;
}
