/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2.5rem"
      },
      screens: {
        "2xl": "1160px"
      }
    },
    extend: {
      colors: {
        border: "rgba(255,255,255,0.07)",
        input: "rgba(255,255,255,0.1)",
        ring: "#5C2B82",
        background: "#1A1A2E",
        foreground: "#F0EEF8",
        primary: {
          DEFAULT: "#5C2B82",
          foreground: "#F0EEF8"
        },
        accent: {
          DEFAULT: "#4ECDC4",
          foreground: "#12121E"
        },
        muted: {
          DEFAULT: "#2A2A3E",
          foreground: "#9A96B4"
        },
        surface: "#2A2A3E",
        deeper: "#12121E"
      },
      fontFamily: {
        sans: ["Heebo", "Inter", "system-ui", "sans-serif"],
        latin: ["Inter", "Heebo", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl: "16px",
        lg: "10px",
        md: "8px"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse at 60% 0%, rgba(92,43,130,0.35) 0%, transparent 65%)",
        "cta-gradient": "linear-gradient(135deg, #5C2B82 0%, #7B3FAD 100%)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-scale": {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(4px)" },
          "75%": { transform: "translateX(-4px)" }
        }
      },
      animation: {
        "fade-up": "fade-up 500ms ease-out both",
        "fade-scale": "fade-scale 550ms ease-out both",
        shake: "shake 240ms ease-in-out"
      }
    }
  },
  plugins: []
};
