/**
 * Three.js ambient layer tuning for the skills section (cyan → emerald).
 */
export const SKILLS_THREE_CONFIG = {
  canvas: {
    cameraPosition: [0, 0, 8] as const,
    fov: 40,
    dprMin: 1,
    dprMax: 1.75,
  },
  sparkles: {
    count: 180,
    scale: 18,
    size: 2.2,
    speed: 0.35,
    opacity: 0.45,
    color: "#22d3ee",
  },
  sparklesAccent: {
    count: 80,
    scale: 14,
    size: 1.6,
    speed: 0.28,
    opacity: 0.35,
    color: "#34d399",
  },
  stars: {
    radius: 60,
    depth: 35,
    count: 1800,
    factor: 2.4,
    saturation: 0,
    fade: true,
    speed: 0.15,
  },
} as const;
