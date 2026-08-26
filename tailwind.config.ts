import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E50914",
          hover: "#B80710",
          glow: "#FF2E38",
          dark: "#8B0000",
        },
        cinema: {
          black: "#060709",
          card: "#12141A",
          surface: "#1A1D24",
          surfaceLight: "#262A34",
          border: "#2F3542",
          muted: "#94A3B8",
          text: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(to top, rgba(6,7,9,1) 0%, rgba(6,7,9,0.7) 40%, rgba(6,7,9,0.2) 80%, rgba(6,7,9,0.6) 100%)",
        "card-gradient": "linear-gradient(to top, rgba(6,7,9,0.95) 0%, rgba(6,7,9,0.4) 60%, rgba(6,7,9,0) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
