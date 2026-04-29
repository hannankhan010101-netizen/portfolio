/**
 * Skill row with a label and proficiency percentage for progress UI.
 */
export interface SkillBarItem {
  readonly id: string;
  readonly label: string;
  readonly percent: number;
}

/**
 * Group of skill bars under a titled section.
 */
export interface SkillBarGroup {
  readonly id: string;
  readonly title: string;
  readonly items: readonly SkillBarItem[];
}

/**
 * Short expertise card in the skills section.
 */
export interface SkillExpertiseCard {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}
