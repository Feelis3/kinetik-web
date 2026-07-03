import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",
        "ink-soft": "#121214",
        surface: "#161618",
        line: "#2A2A2E",
        "line-soft": "#1E1E22",
        cloud: "#F5F5F5",
        "cloud-dim": "#A8A8AD",
        mute: "#6E6E73",
        // Mono / stealth system: pure white is the only "accent".
        acid: "#FFFFFF",
        "acid-deep": "#D4D4D8",
        sale: "#FF3B30",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 13vw, 13rem)", { lineHeight: "0.86", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.75rem, 8vw, 7rem)", { lineHeight: "0.9", letterSpacing: "-0.01em" }],
        "heading-xl": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
      },
      spacing: {
        section: "clamp(5rem, 12vw, 11rem)",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        power4: "cubic-bezier(0.77, 0, 0.175, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
