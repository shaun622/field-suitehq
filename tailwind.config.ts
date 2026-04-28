import type { Config } from "tailwindcss";

/**
 * Field Mate uses a parent neutral system + a CSS-variable-driven brand
 * palette per product. Set `--brand-50..950` on a wrapper element to retheme
 * a whole page/section without touching markup. Stock Tailwind palettes used
 * for status (emerald=success, amber=warn, red=danger).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Parent (Field Mate) — quiet neutral, dark-first
        ink: {
          950: "#07100a",
          900: "#0c1812",
          850: "#111e17",
          800: "#15241c",
          700: "#1c3024",
          600: "#284635",
          500: "#3f6650",
        },
        bone: {
          50:  "#f7f6f2",
          100: "#efece4",
          200: "#e3dfd2",
        },
        hivis: "#f6ff3b",
        // CSS-var-driven product palette
        brand: {
          50:  "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
          950: "rgb(var(--brand-950) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "IBM Plex Mono", "ui-monospace", "monospace"],
        // Display: Montserrat (geometric sans) for italic accents + large numerals.
        display: ["var(--font-display)", "Montserrat", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grad-brand": "linear-gradient(135deg, rgb(var(--brand-400)) 0%, rgb(var(--brand-700)) 100%)",
        "grad-brand-soft": "linear-gradient(135deg, rgb(var(--brand-300)) 0%, rgb(var(--brand-600)) 100%)",
        "grad-dusk": "linear-gradient(160deg, rgb(var(--brand-900)) 0%, #07100a 60%, #0c1812 100%)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(8,30,18,.08)",
        glow: "0 8px 28px rgba(var(--brand-500) / .35)",
        deep: "0 20px 60px rgba(0,0,0,.5)",
      },
      borderRadius: {
        "2xl-2": "22px",
      },
      letterSpacing: {
        tightest: "-0.035em",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in": "fade-in .4s ease-out both",
        "slide-up": "slide-up .5s cubic-bezier(0.22,1,0.36,1) both",
        "marquee": "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
