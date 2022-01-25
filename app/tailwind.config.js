const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './public/index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
