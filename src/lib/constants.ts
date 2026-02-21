/** UATX centers — multi-select on student profile. Topic and field tags live in @/lib/tags. */
export const UATX_CENTERS = ["CAL", "CEPH", "STEM", "CEPS"] as const;

export type UatxCenter = (typeof UATX_CENTERS)[number];
