/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        'background': 'var(--color-background)',
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'accent': 'var(--color-accent)',
        'crd-blue': '#3B3BA4',
        'crd-red': '#9A2F27',
        'crd-green': '#57973E',
        'crd-purple': '#222222',
      },
    }
  },
  plugins: [],
}
