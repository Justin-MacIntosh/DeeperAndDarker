/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        'dark-purple': '#1A090D',
        'med-purple': '#4A314d',
        'light-purple': '#6B6570',
        'crd-blue': '#5B5BC4',
        'crd-red': '#AA3F37',
        'crd-green': '#57973E',
      },
    }
  },
  plugins: [],
}
