import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pink: {
          hot: "#e23d80",
          soft: "#f5a0c0",
          bg: "#fdf0f4",
        },
        purple: {
          deep: "#6b2fa0",
          light: "#c9a0dc",
        },
        cream: "#fefaf6",
      },
      fontFamily: {
        marker: ['"Permanent Marker"', "cursive"],
        display: ['"Playfair Display"', "serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
