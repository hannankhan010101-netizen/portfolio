import { SECTION_IDS } from "@/constants/section-ids";

/**
 * Primary anchor links for the sticky header.
 */
export const PRIMARY_NAV_LINKS = [
  { id: SECTION_IDS.ABOUT, label: "About" },
  { id: SECTION_IDS.SKILLS, label: "Skills" },
  { id: SECTION_IDS.PROJECTS, label: "Projects" },
  { id: SECTION_IDS.EXPERIENCE, label: "Experience" },
  { id: SECTION_IDS.CONTACT, label: "Contact" },
] as const;
