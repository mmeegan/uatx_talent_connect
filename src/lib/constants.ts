/** Fixed options for topics (expertise / what you need help with). Shared by students and mentors. */
export const TOPIC_OPTIONS = [
  "Career transition",
  "Product management",
  "Engineering & technical",
  "Design & UX",
  "Leadership & management",
  "Startup & founding",
  "Interviewing & job search",
  "Writing & communication",
  "Research & strategy",
  "Data & analytics",
  "Work-life balance",
  "Public speaking & presenting",
  "Negotiation & compensation",
  "Building a team / hiring",
  "Other",
] as const;

/** Fixed options for industries / fields. Shared by students and mentors. */
export const INDUSTRY_OPTIONS = [
  "Tech / software",
  "Healthcare",
  "Finance",
  "Design / creative",
  "Education",
  "Government / policy",
  "Nonprofit",
  "Media & entertainment",
  "Other",
] as const;

/** UATX centers — multi-select on student profile. */
export const UATX_CENTERS = ["CAL", "CEPH", "STEM", "CEPS"] as const;

export type TopicOption = (typeof TOPIC_OPTIONS)[number];
export type IndustryOption = (typeof INDUSTRY_OPTIONS)[number];
export type UatxCenter = (typeof UATX_CENTERS)[number];
