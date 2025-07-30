/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        'dark-purple': '#1A090D',
        'med-purple': '#4A314d',
        'light-purple': '#6B6570',
        'card-blue': '#6B6BD4',
        'card-red': '#DA5F57',
        'card-green': '#57973E',
      },
    }
  },
  plugins: [],
}
