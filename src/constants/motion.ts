/**
 * Shared motion timing for a restrained, professional feel (ease-out expo-ish).
 */
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

export const MOTION_DURATION = {
  fast: 0.35,
  medium: 0.55,
  slow: 0.75,
} as const;
