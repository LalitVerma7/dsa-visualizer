/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08090c",
          900: "#0d0f14",
          850: "#12151c",
          800: "#181c25",
          700: "#232834",
          600: "#323847",
          500: "#4a5164",
        },
        signal: {
          purple: "#8b6bf2",
          purpleSoft: "#5f4fb8",
          coral: "#ff6b6b",
          mint: "#3ddc97",
          amber: "#ffb454",
          sky: "#4fd3ff",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(139, 107, 242, 0.35)",
        glowCoral: "0 0 24px rgba(255, 107, 107, 0.35)",
        glowMint: "0 0 24px rgba(61, 220, 151, 0.35)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
    },
  },
  plugins: [],
};
