/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.ejs'],
  theme: {
  extend: {
    colors: {
      landingGreen: '#89C878'
    }
  },
  },
  plugins: [
  {
  tailwindcss: {},
  autoprefixer: {},
  },
  ],
  };