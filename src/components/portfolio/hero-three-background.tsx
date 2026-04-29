"use client";

import dynamic from "next/dynamic";

const HeroThreeScene = dynamic(
  () =>
    import("@/components/portfolio/hero-three-scene").then(
      (mod) => mod.HeroThreeScene,
    ),
  { ssr: false, loading: () => null },
);

/**
 * Client-only WebGL hero layer (Canvas must not run during SSR).
 */
export function HeroThreeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 min-h-[min(85vh,720px)]">
      <HeroThreeScene className="h-full w-full" />
    </div>
  );
}
