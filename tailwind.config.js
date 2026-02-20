/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        constellate: {
          bg: "#0B0F14",
          "nav-from": "#0E131A",
          "nav-to": "#0B0F14",
          surface: "rgba(255,255,255,0.02)",
          border: "rgba(255,255,255,0.08)",
          "text-primary": "#F4F4F2",
          "text-secondary": "rgba(244,244,242,0.6)",
          "text-muted": "rgba(244,244,242,0.4)",
          gold: "#C6A75E",
          "gold-muted": "rgba(198,167,94,0.7)",
          "gold-glow": "rgba(198,167,94,0.08)",
        },
        gold: {
          DEFAULT: "#C6A75E",
          muted: "rgba(198,167,94,0.7)",
          glow: "rgba(198,167,94,0.08)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        section: ["1.125rem", { lineHeight: "1.35" }],
        body: ["0.9375rem", { lineHeight: "1.6" }],
        small: ["0.8125rem", { lineHeight: "1.5" }],
      },
      boxShadow: {
        "gold-ring": "0 0 0 1px rgba(198,167,94,0.25)",
        "gold-glow": "0 0 20px rgba(198,167,94,0.08)",
      },
    },
  },
  plugins: [],
};
