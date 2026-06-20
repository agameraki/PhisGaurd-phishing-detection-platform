/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A0A0A",
        secondary: "#F8F9FA",
        danger: {
          light: "#FEE2E2",
          DEFAULT: "#EF4444",
          dark: "#B91C1C",
        },
        warning: {
          light: "#FEF3C7",
          DEFAULT: "#F59E0B",
          dark: "#B45309",
        },
        success: {
          light: "#D1FAE5",
          DEFAULT: "#10B981",
          dark: "#065F46",
        },
        card: "#FFFFFF",
        border: "#E5E7EB",
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};