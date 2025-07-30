/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        'dark-purple': '#1A090D',
        'med-purple': '#4A314d',
        'light-purple': '#6B6570',
        'crd-blue': '#6B6BD4',
        'crd-red': '#DA5F57',
        'crd-green': '#57973E',
      },
    }
  },
  plugins: [],
}
