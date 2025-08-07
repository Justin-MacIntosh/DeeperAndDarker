/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        'dark': 'var(--color-dark)',
        'med': 'var(--color-med)',
        'light': 'var(--color-light)',
        'crd-blue': '#5B5BC4',
        'crd-red': '#AA3F37',
        'crd-green': '#57973E',
      },
    }
  },
  plugins: [],
}
