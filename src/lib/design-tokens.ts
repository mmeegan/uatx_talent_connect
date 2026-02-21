/**
 * Constellate design tokens — cinematic, editorial, instrument-grade.
 * Use these in components and Tailwind where needed.
 */

export const tokens = {
  background: "#0B0F14",
  surface: {
    subtle: "rgba(255,255,255,0.02)",
    base: "rgba(255,255,255,0.03)",
    elevated: "rgba(255,255,255,0.04)",
  },
  border: {
    subtle: "rgba(255,255,255,0.06)",
    base: "rgba(255,255,255,0.08)",
    strong: "rgba(255,255,255,0.12)",
  },
  text: {
    primary: "#F4F4F2",
    secondary: "rgba(244,244,242,0.6)",
    muted: "rgba(244,244,242,0.4)",
  },
  gold: {
    accent: "#C6A75E",
    muted: "rgba(198,167,94,0.7)",
    bloom: "rgba(198,167,94,0.08)",
  },
  nav: {
    height: "92px",
    gradientFrom: "#0E131A",
    gradientTo: "#0B0F14",
  },
  footer: {
    height: "72px",
  },
} as const;
