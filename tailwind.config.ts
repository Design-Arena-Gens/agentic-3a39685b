import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        lemon: {
          50: "#FFFDEA",
          100: "#FFF6B3",
          200: "#FFEF80",
          300: "#FFE54D",
          400: "#FFDC26",
          500: "#FFD400",
          600: "#E6BE00",
          700: "#B39100",
          800: "#806500",
          900: "#4D3900"
        }
      },
      boxShadow: {
        "hero": "0 20px 50px rgba(0,0,0,0.25)"
      }
    }
  },
  plugins: []
};

export default config;

