/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080D16',
        surface: '#111C2D',
        surfaceHighlight: '#162338',
        primary: '#4BD5E8',
        secondary: '#9788EF',
        textMain: '#F3F6FC',
        textMuted: '#98A9C1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
