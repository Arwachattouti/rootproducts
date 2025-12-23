/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', 
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // On ajoute la police ici pour pouvoir utiliser la classe 'font-seasons'
        seasons: ['"The Seasons"', 'serif'],
      },
    },
  },
  plugins: [],
};