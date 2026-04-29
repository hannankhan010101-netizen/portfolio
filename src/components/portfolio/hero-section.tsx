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
      className="relative min-h-[min(88vh,760px)] overflow-hidden border-b border-white/10 bg-zinc-950"
    >
      <HeroThreeBackground />
      <div className="three-bg-overlay pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-zinc-950/88 via-zinc-950/48 to-zinc-900/96" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(34,211,238,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_85%_30%,rgba(52,211,153,0.06),transparent_45%)]" />
      <HeroSectionInner />
    </section>
  );
}
