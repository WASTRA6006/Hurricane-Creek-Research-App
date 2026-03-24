import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Emerald/Green (main brand, Activate button)
        primary: {
          DEFAULT: '#059669',  // emerald-600
          light: '#10b981',    // emerald-500
          dark: '#047857',     // emerald-700
        },
        // Secondary - Cyan/Teal (accents, Flag button)
        secondary: {
          DEFAULT: '#0891b2',  // cyan-600
          light: '#06b6d4',    // cyan-500
          dark: '#0e7490',     // cyan-700
        },
        // Neutral - Slate/Blue-Gray (Hide button, backgrounds)
        neutral: {
          DEFAULT: '#64748b',  // slate-500
          light: '#94a3b8',    // slate-400
          dark: '#475569',     // slate-600
        },
        // Action colors - all in cool spectrum
        success: '#059669',    // emerald-600 (same as primary)
        info: '#0891b2',       // cyan-600 (same as secondary)
        muted: '#64748b',      // slate-500 (same as neutral)
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        splash: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
          '70%': { transform: 'scale(0.95)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in forwards',
        fadeOut: 'fadeOut 0.5s ease-out 2s forwards',
        splash: 'splash 1.5s ease-out forwards',
      }
    },
  },
  plugins: [],
};

export default config;