/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./theme/**/*.html", 
      "./docs/**/*.md"    
    ],
    theme: {
      extend: {},
    },
    plugins: [require('@tailwindcss/typography'),],
  }