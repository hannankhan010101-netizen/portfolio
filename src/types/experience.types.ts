/**
 * Single role in the work experience timeline.
 */
export interface ExperienceEntry {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly dateRange: string;
  readonly responsibilities: readonly string[];
  readonly technologies: readonly string[];
}
