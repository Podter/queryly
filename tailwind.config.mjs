import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [...fontFamily.sans],
        mono: [...fontFamily.mono],
        serif: [...fontFamily.serif],
      },
    },
  },
  plugins: [],
};
