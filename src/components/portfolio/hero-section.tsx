import { SECTION_IDS } from "@/constants/section-ids";
import { HeroThreeBackground } from "@/components/portfolio/hero-three-background";
import { HeroSectionInner } from "@/components/portfolio/hero-section-inner";

/**
 * Hero band with WebGL background, gradients, and motion-driven foreground.
 */
export function HeroSection() {
  return (
    <section
      id={SECTION_IDS.HERO}
      className="relative min-h-[min(88vh,760px)] overflow-hidden border-b border-white/[0.07] bg-[#020c1b]"
    >
      <HeroThreeBackground />
      {/* Subtle dark vignette so particles read against the navy bg */}
      <div className="three-bg-overlay pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#020c1b]/40 via-transparent to-[#020c1b]/60" />
      {/* Top-centre cyan bloom — professional brand accent */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(34,211,238,0.09),transparent_55%)]" />
      {/* Subtle right-side depth */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_40%_60%_at_95%_50%,rgba(56,189,248,0.04),transparent_55%)]" />
      <HeroSectionInner />
    </section>
  );
}
