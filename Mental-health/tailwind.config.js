/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Purple Mental Health Theme
        mindmate: {
          50: '#F9F7FE',
          100: '#F3EDFE',
          200: '#E6D9FF',
          300: '#DCCBFF',
          400: '#C9B0FF',
          500: '#A88CFF',
          600: '#8B6CFF',
          700: '#7554E8',
          800: '#5E3CC7',
          900: '#4A2D9F',
        },
        // Additional calming purple shades
        lavender: {
          50: '#FAF8FF',
          100: '#F5F0FF',
          200: '#E9DEFF',
          300: '#DCC9FF',
          400: '#C9A7FF',
          500: '#B185FF',
          600: '#9B5FFF',
          700: '#8441E8',
          800: '#6D28CC',
          900: '#5818A3',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(168, 140, 255, 0.1), 0 10px 20px -2px rgba(168, 140, 255, 0.05)',
        'soft-lg': '0 10px 40px -10px rgba(168, 140, 255, 0.2)',
        'purple': '0 4px 14px 0 rgba(168, 140, 255, 0.39)',
        'purple-lg': '0 10px 30px 0 rgba(168, 140, 255, 0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '92': '23rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
