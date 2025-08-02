/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Custom class replacement for `glass-card`
      boxShadow: {
        'glass': '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
      },
      backdropBlur: {
        'glass': '10px',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.18)',
      },
    },
  },
  plugins: [],
}
