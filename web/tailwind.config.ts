import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brevly Design System Colors (from Figma)
        blue: {
          base: '#2C46B1', // blue/blue-base
          dark: '#2C4091', // blue/blue-dark
        },
        gray: {
          50: '#F9F9FB',    // grayscale/gray-100 (light background)
          100: '#F9F9FB',   // grayscale/gray-100
          200: '#E4E6EC',   // grayscale/gray-200 (borders, dividers)
          300: '#CDCFD5',   // grayscale/gray-300 (from styleguide)
          400: '#74798B',   // grayscale/gray-400 (secondary text)
          500: '#4D505C',   // grayscale/gray-500 (body text)
          600: '#1F2025',   // grayscale/gray-600 (dark text)
          700: '#7C7C8A',   // Gray/gray-700 (from styleguide)
          800: '#8D8D99',   // Gray/gray-800 (from styleguide)
          950: '#09090A',   // Gray/gray-100 (Dark) - very dark surface
        },
        danger: '#B12C4D',  // feedback/danger (error states)
        white: '#FFFFFF',   // grayscale/white
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
    },
  },
} satisfies Config;