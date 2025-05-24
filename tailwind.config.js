/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ff4136",
          50: "#fff5f5",
          100: "#ffe3e2",
          200: "#ffc9c7",
          300: "#ff9e9a",
          400: "#ff6a62",
          500: "#ff4136",
          600: "#ef2d22",
          700: "#cc1c12",
          800: "#a81b12",
          900: "#891c15",
          950: "#4c0903",
        },
        secondary: {
          DEFAULT: "#f9f4e8",
          50: "#fefcf9",
          100: "#f9f4e8",
          200: "#f5ebd5",
          300: "#ead9b4",
          400: "#e0c690",
          500: "#d5b36e",
          600: "#c9a051",
          700: "#b78d3f",
          800: "#97742f",
          900: "#7a5f28",
          foreground: "#2d2d2d", // Text color on secondary background
        },
        accent: {
          DEFAULT: "#7bbb69",
          foreground: "#ffffff", // Text color on accent background
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },
        dark: {
          DEFAULT: "#171717",
        },
      },
      borderRadius: {
        pill: "9999px",
      },
      boxShadow: {
        card: "0 4px 15px rgba(0, 0, 0, 0.05)",
        hover: "0 10px 25px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
