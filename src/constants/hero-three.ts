/**
 * Visual tuning for the Three.js hero scene (non-secret design tokens).
 */
export const HERO_THREE_CONFIG = {
  canvas: {
    cameraPosition: [0, 0.15, 7.2] as const,
    fov: 42,
    dprMin: 1,
    dprMax: 2,
  },
  stars: {
    radius: 90,
    depth: 52,
    count: 4200,
    factor: 2.6,
    saturation: 0,
    fade: true,
    speed: 0.28,
  },
  sparkles: {
    count: 120,
    scale: 14,
    size: 2.4,
    speed: 0.4,
    opacity: 0.55,
    color: "#5eead4",
  },
  wireframePrimary: {
    color: "#0891b2",
    emissive: "#22d3ee",
    emissiveIntensity: 0.45,
    metalness: 0.35,
    roughness: 0.25,
    opacity: 0.55,
    icosahedronArgs: [1.52, 1] as const,
  },
  wireframeSecondary: {
    color: "#047857",
    emissive: "#34d399",
    emissiveIntensity: 0.32,
    metalness: 0.4,
    roughness: 0.3,
    opacity: 0.38,
    torusKnotArgs: [0.82, 0.24, 200, 32] as const,
  },
  float: {
    speed: 1.1,
    rotationIntensity: 0.18,
    floatIntensity: 0.28,
  },
  rotation: {
    primary: { x: 0.09, y: 0.14 },
    secondary: { x: -0.12, y: 0.11 },
  },
  lights: {
    ambient: 0.22,
    key: { color: "#22d3ee", intensity: 1.15, position: [4.2, 3.5, 5] as const },
    fill: { color: "#6ee7b7", intensity: 0.45, position: [-4, -1.5, 3] as const },
  },
} as const;
