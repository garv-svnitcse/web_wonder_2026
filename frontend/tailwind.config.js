/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c5a880',
          dark: '#b0926a',
        },
        jungle: {
          DEFAULT: '#0a0f0d',
          dark: '#050806',
        }
      },
      fontFamily: {
        serif: ['Outfit', 'Georgia', 'serif'],
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
