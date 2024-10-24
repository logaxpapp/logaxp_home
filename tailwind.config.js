/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Custom Colors
      colors: {
        primary: {
          light: 'var(--color-primary-light)',
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          light: '#f59e0b', // Amber-500
          DEFAULT: '#d97706', // Amber-600
          dark: '#b45309', // Amber-700
        },
        accent: {
          light: '#84cc16', // Lime-500
          DEFAULT: '#65a30d', // Lime-600
          dark: '#4d7c0f', // Lime-700
        },
        neutral: {
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Adding lemonGreen and deepBlue colors
        lemonGreen: {
          light: '#89E101',  // Light Lemon Green
          DEFAULT: '#A3D900', // Default Lemon Green
          dark: '#8ABB00',    // Darker Lemon Green
        },
        deepBlue: {
          light: '#4A73C9',   // Light Deep Blue
          DEFAULT: '#1D4ED8', // Default Deep Blue
          dark: '#1d3557',    // Darker Deep Blue
        },
        fontFamily: {
          'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        },
      },

      // 2. Custom Widths (Add larger than w-2/3)
      width: {
        '1/2': '50%',
        '2/3': '66.666667%',
        '3/4': '75%', // Standard width
        '5/6': '83.333333%', // Larger custom width
        '9/10': '90%',  // Custom width, 90%
        '95': '95%',    // Custom width, 95%
        '120': '120%',  // Custom width, larger than 100%
        'full': '100%', // Full width
      },

      // Other custom extensions (fontFamily, spacing, etc.) remain unchanged
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Any other plugins
    function ({ addUtilities, theme, e }) {
      const newUtilities = {
        '.skew-15deg': {
          transform: 'skewY(-15deg)',
        },
        '.skew-30deg': {
          transform: 'skewY(-30deg)',
        },
        // Add more custom utilities as needed
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
