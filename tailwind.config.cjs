/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Merriweather', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },

  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};