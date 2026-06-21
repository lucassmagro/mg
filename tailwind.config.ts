import type { Config } from "tailwindcss";

/**
 * ACCENT COLOR — single source of truth.
 * Azul corporativo da marca MG Incorporações (#0f4e9f). Cada botão, badge,
 * link e destaque lê de `accent`. Para rebrand, troque toda a escala abaixo.
 */
const accent = {
  50: "#eef3fb",
  100: "#d6e2f5",
  200: "#aec6ec",
  300: "#7ba3df",
  400: "#4a7ccd",
  500: "#2a5fb5",
  600: "#0f4e9f", // primary accent — azul da marca
  700: "#0d4185",
  800: "#0d356a",
  900: "#0e2c54",
  950: "#0a1d39",
};

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent,
        // Warm neutral base
        sand: {
          50: "#faf9f6",
          100: "#f4f2ec",
          200: "#e8e4d9",
          300: "#d8d2c2",
        },
        ink: {
          DEFAULT: "#1a1a17",
          soft: "#3d3d38",
          muted: "#6b6b63",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,26,23,0.04), 0 8px 24px -12px rgba(26,26,23,0.18)",
        "card-hover":
          "0 2px 4px rgba(26,26,23,0.05), 0 18px 40px -18px rgba(26,26,23,0.30)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
