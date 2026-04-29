import type { ProjectCategoryFilterKey } from "@/constants/project-categories";

/**
 * Filter tags assigned to projects (excludes the synthetic "all" chip).
 */
export type ProjectTagFilterKey = Exclude<ProjectCategoryFilterKey, "all">;

/**
 * Portfolio project shown in the projects grid.
 */
export interface PortfolioProject {
  readonly id: string;
  readonly name: string;
  readonly badgeLabel: string;
  readonly summary: string;
  readonly techStack: readonly string[];
  readonly keyFeatures: readonly string[];
  readonly architectureMarkdown: string;
  readonly githubUrl: string;
  readonly liveDemoUrl: string | null;
  readonly liveDemoLabel: string;
  readonly filterKeys: readonly ProjectTagFilterKey[];
  readonly videoUrl?: string | null;
}
