/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#fef5ee',
            100: '#fde9d7',
            200: '#fad0ae',
            300: '#f6af7b',
            400: '#f18446',
            500: '#ed6420',
            600: '#de4a16',
            700: '#b83714',
            800: '#922e18',
            900: '#762816',
          },
          secondary: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          }
        },
        fontFamily: {
          'sinhala': ['Noto Sans Sinhala', 'sans-serif'],
          'tamil': ['Noto Sans Tamil', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }