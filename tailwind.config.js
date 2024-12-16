// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Grid columns
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    // Gaps
    'gap-0',
    'gap-1',
    'gap-2',
    'gap-3',
    'gap-4',
    'gap-5',
    'gap-6',
    'gap-8',
    'gap-10',
    'gap-12',
    // Flex directions
    'flex-row',
    'flex-column',
    'flex-row-reverse',
    'flex-column-reverse',
    // Justify content
    'justify-start',
    'justify-center',
    'justify-end',
    'justify-between',
    'justify-around',
    'justify-evenly',
    // Align items
    'items-start',
    'items-center',
    'items-end',
    'items-stretch',
    'items-baseline',
    // Gaps for FlexBox (redundant but included for clarity)
    'gap-0',
    'gap-1',
    'gap-2',
    'gap-3',
    'gap-4',
    'gap-5',
    'gap-6',
    // Add any other classes you use dynamically
  ],
  theme: {
    extend: {
      // Custom max-widths
      maxWidth: {
        '8xl': '103rem',  // 1536px
        '9xl': '112rem', // 1792px
        '10xl': '128rem', // 2048px
      },
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
          light: '#89E101',  // Light Lemon Green 89e101
          DEFAULT: '#A3D900', // Default Lemon Green
          dark: '#011934',    // Darker Lemon Green
        },
        deepBlue: {
          light: '#4A73C9',   // Light Deep Blue
          DEFAULT: '#1D4ED8', // Default Deep Blue
          dark: '#011934',
          lighter: '#1D4ED8', // Lighter Deep Blue
          new:'#023e8a',
        },
      },

      // 2. Custom Widths
      width: {
        '1/2': '50%',
        '2/3': '66.666667%',
        '3/4': '75%',
        '5/6': '83.333333%',
        '9/10': '90%',
        '95': '95%',
        '120': '120%',
        'full': '100%',
      },
      

      fontFamily: {
        primary: ['Menseal', 'sans-serif'],
        secondary: ['Plus Jakarta Sans', 'sans-serif'],
      },

    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Any other plugins
    function ({ addUtilities }) {
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
