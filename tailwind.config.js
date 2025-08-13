/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      transitionTimingFunction: {
        smooth: "cubic-bezier(.4,0,.2,1)",
      },
      boxShadow: {
        soft: "0 6px 30px rgba(0,0,0,.15)",
        card: "0 8px 24px rgba(0,0,0,.12)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in":
          "fade-in .5s var(--tw-ease, cubic-bezier(.2,.7,.2,1)) forwards",
      },
    },
  },
  plugins: [],
};
