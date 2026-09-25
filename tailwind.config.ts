import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        crema: "#F7F3EC",
        rojo: "#E24B4A",
        verde: "#C6E86B",
        negro: "#212121",
        amarillo: "#FAEC7F",
        mostaza: "#ECB92D",
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
