import { AboutSection } from "@/components/portfolio/about-section";
import { AIFeaturesSection } from "@/components/portfolio/ai-features-section";
import { ContactSection } from "@/components/portfolio/contact-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { HeroSection } from "@/components/portfolio/hero-section";
import { MobileHireCta } from "@/components/portfolio/mobile-hire-cta";
import { ProcessSection } from "@/components/portfolio/process-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { SiteHeader } from "@/components/portfolio/site-header";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { StatsBar } from "@/components/portfolio/stats-bar";
import { TrustSection } from "@/components/portfolio/trust-section";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-zinc-950 text-zinc-50">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <StatsBar />
        <AIFeaturesSection />
        <AboutSection />
        <ProcessSection />
        <TrustSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <MobileHireCta />
    </div>
  );
}
