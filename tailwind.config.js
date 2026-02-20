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
          surface: "#18181b",
          border: "#27272a",
          "text-primary": "#fafafa",
          "text-secondary": "#a1a1aa",
          accent: "#e7e5e4",
          cta: "#e7e5e4",
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
    },
  },
  plugins: [],
};
