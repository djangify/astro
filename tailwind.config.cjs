/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      // This completely replaces Tailwind's default scale
      'base': '1.125rem', // Previously 1rem  
      'lg': '1.25rem',   // Previously 1.125rem
      'xl': '1.5rem',    // Previously 1.25rem

    },
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