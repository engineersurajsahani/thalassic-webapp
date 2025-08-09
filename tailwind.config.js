/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'josefin': ['Josefin Sans', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'global': {
          1: 'var(--global-text-1)',
          2: 'var(--global-text-2)',
          3: 'var(--global-text-3)',
          4: 'var(--global-text-4)',
          5: 'var(--global-text-5)',
        },
        'header': {
          1: 'var(--header-text-1)',
        },
        'button': {
          1: 'var(--button-text-1)',
        }
      },
      backgroundColor: {
        'global': {
          1: 'var(--global-bg-1)',
          2: 'var(--global-bg-2)',
          3: 'var(--global-bg-3)',
          4: 'var(--global-bg-4)',
          5: 'var(--global-bg-5)',
          6: 'var(--global-bg-6)',
          7: 'var(--global-bg-7)',
          8: 'var(--global-bg-8)',
          9: 'var(--global-bg-9)',
          10: 'var(--global-bg-10)',
          11: 'var(--global-bg-11)',
        },
        'button': {
          1: 'var(--button-bg-1)',
        }
      }
    },
  },
  plugins: [],
}
