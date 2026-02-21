/**
 * Single source of truth for topic and field tags. Used everywhere tags appear:
 * student request form, mentor profile/expertise, filters, etc.
 */

/** Topics (what you need help with / what you mentor on). Exactly 11 options. */
export const TOPIC_TAGS = [
  "Career direction",
  "Leadership & management",
  "Starting a company",
  "Research & scholarship",
  "Writing & rhetoric",
  "Public speaking",
  "Policy & public life",
  "Technical & engineering",
  "Data & analytics",
  "Interviewing & compensation",
  "Building teams",
] as const;

/** Industries / fields (optional). Exactly 9 options. */
export const FIELD_TAGS = [
  "Technology",
  "Finance & investing",
  "Entrepreneurship",
  "Government & policy",
  "Law",
  "Media & journalism",
  "Education",
  "Nonprofit",
  "Engineering & science",
] as const;

export type TopicTag = (typeof TOPIC_TAGS)[number];
export type FieldTag = (typeof FIELD_TAGS)[number];
