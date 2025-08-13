
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(10,10,12)",
        foreground: "rgb(248,248,248)",
        card: "rgb(18,18,22)",
        muted: "rgb(140,140,160)",
        accent: "rgb(99,102,241)"
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(0,0,0,.45)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    },
  },
  plugins: [],
}
