/**
 * Keys used for project filter chips and per-project tagging.
 */
export const PROJECT_CATEGORY_FILTER_KEYS = {
  ALL: "all",
  BACKEND: "backend",
  API: "api",
  ARCHITECTURE: "architecture",
  CRM_SYSTEMS: "crmSystems",
} as const;

export type ProjectCategoryFilterKey =
  (typeof PROJECT_CATEGORY_FILTER_KEYS)[keyof typeof PROJECT_CATEGORY_FILTER_KEYS];
