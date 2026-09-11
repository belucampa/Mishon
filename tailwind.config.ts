import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        crema: "#F7F3EC",
        lima: "#C6E86B",
        tomate: "#E24B4A",
        mostaza: "#EF9F27",
        negro: "#1A1A1A",
        azul: "#3E4C59",
      },
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
