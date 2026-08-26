/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Real grass green -- used only for literal pitch/turf textures
        // (pitch-stripes, pitch-markings in globals.css represent an
        // actual football pitch, not brand chrome).
        pitch: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        // "Dark Stadium" brand accent -- floodlight cyan, used for every
        // interactive/brand element (buttons, active states, focus,
        // score bars) instead of green, so it reads distinctly from the
        // grass graphics rather than blending into them.
        volt: {
          300: "#a5f3fc",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0e7490",
        },
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(34, 211, 238, 0.45)",
        "glow-sm": "0 0 18px -4px rgba(34, 211, 238, 0.5)",
      },
    },
  },
  plugins: [],
};
