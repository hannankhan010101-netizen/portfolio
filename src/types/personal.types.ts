/**
 * Public contact and social identifiers for the portfolio owner.
 */
export interface ContactLinks {
  readonly email: string;
  readonly phoneDisplay: string;
  readonly phoneTel: string;
  readonly linkedInUrl: string;
  readonly linkedInDisplay: string;
  readonly gitHubUrl: string;
  readonly gitHubDisplay: string;
}

/**
 * Education entry for the About section.
 */
export interface EducationEntry {
  readonly degree: string;
  readonly institution: string;
}

/**
 * Short highlight bullet in About.
 */
export interface AboutHighlight {
  readonly id: string;
  readonly text: string;
}

/**
 * Specialization card in About.
 */
export interface AboutSpecialization {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}
