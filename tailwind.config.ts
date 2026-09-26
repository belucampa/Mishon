import type { Config } from "tailwindcss";
import sitio from "./content/sitio.json";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Los colores se editan desde el panel (content/sitio.json).
      colors: sitio.colores,
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        button: ["var(--font-button)", "sans-serif"],
        wordmark: ["var(--font-wordmark)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
