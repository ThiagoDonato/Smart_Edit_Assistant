/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'level-1': '#3B82F6', // Blue for grammar
        'level-2': '#F59E0B', // Yellow for cohesion
        'level-3': '#EF4444', // Red for content
      }
    },
  },
  plugins: [],
} 