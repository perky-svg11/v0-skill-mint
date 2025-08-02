/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // If you used `glass-card`, you must define it here
      // Example:
      // colors: { ... }
    },
  },
  plugins: [],
}
