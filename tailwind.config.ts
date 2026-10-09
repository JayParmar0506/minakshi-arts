import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0B0B0C",
          50: "#1A191C",
          100: "#141316",
          200: "#100F12",
          300: "#0D0C0E",
          400: "#0B0B0C",
          500: "#070708",
        },
        gold: {
          50: "#FDF8E7",
          100: "#FBF0C4",
          200: "#F6DF89",
          300: "#EFC64F",
          400: "#E5AC25",
          500: "#D4AF37", // Molten Gold
          600: "#A88320",
          700: "#7A5C14",
        },
        diya: {
          light: "#FCD34D",
          amber: "#F59E0B",
          glow: "#F97316",
          flame: "#EF4444",
        },
        terracotta: {
          100: "#FFEDD5",
          300: "#FDBA74",
          500: "#EA580C",
          600: "#C2410C", // Raw Terracotta
          700: "#9A3412",
          900: "#431407",
        },
        sand: {
          50: "#FCFAF8",
          100: "#F4EFEA", // Off-white / sand
          200: "#E7E0D8",
          300: "#D6CEC4",
          400: "#B0A79B",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      animation: {
        "flame-pulse": "flamePulse 3s ease-in-out infinite",
        "golden-shimmer": "goldenShimmer 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 25s linear infinite",
      },
      keyframes: {
        flamePulse: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
        goldenShimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "radial-diya": "radial-gradient(circle at center, rgba(245, 158, 11, 0.25) 0%, rgba(194, 65, 12, 0.08) 45%, rgba(11, 11, 12, 0) 70%)",
        "gold-gradient": "linear-gradient(135deg, #F6DF89 0%, #D4AF37 50%, #99781E 100%)",
        "terracotta-gradient": "linear-gradient(135deg, #F97316 0%, #C2410C 60%, #7C2D12 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
