import type { Config } from "tailwindcss";

/**
 * ACCENT COLOR — escala azul da marca MG Incorporações (#0f4e9f).
 * Usada em botões/faixas (mesma cor nos dois temas).
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

/**
 * Tokens semânticos via CSS variables (ver app/globals.css).
 * `sand` (fundos), `ink` (textos), `surface` (cartões) e `brand` (azul de
 * texto/ícones) trocam de valor no modo escuro (.dark) — a maioria das classes
 * inverte automaticamente. `night` é fixo, para overlays sobre fotos.
 */
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent,
        sand: {
          50: v("--sand-50"),
          100: v("--sand-100"),
          200: v("--sand-200"),
          300: v("--sand-300"),
        },
        ink: {
          DEFAULT: v("--ink"),
          soft: v("--ink-soft"),
          muted: v("--ink-muted"),
        },
        surface: v("--surface"),
        brand: v("--brand"),
        night: "#0b0f17",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,15,25,0.06), 0 8px 24px -12px rgba(10,15,25,0.25)",
        "card-hover":
          "0 2px 4px rgba(10,15,25,0.08), 0 18px 40px -18px rgba(10,15,25,0.38)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
