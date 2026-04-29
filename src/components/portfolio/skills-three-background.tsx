"use client";

import dynamic from "next/dynamic";

const SkillsThreeScene = dynamic(
  () =>
    import("@/components/portfolio/skills-three-scene").then(
      (mod) => mod.SkillsThreeScene,
    ),
  { ssr: false, loading: () => null },
);

/**
 * Client-only WebGL layer behind the skills grid.
 */
export function SkillsThreeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 min-h-[420px]">
      <SkillsThreeScene className="h-full w-full" />
    </div>
  );
}
