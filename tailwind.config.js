/** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       "./src/**/*.{js,jsx,ts,tsx}",
     ],
     theme: {
       extend: {
         colors: {
           'brand': {
             50: '#e6fbff',
             100: '#ccf7ff',
             200: '#99efff',
             300: '#66e7ff',
             400: '#33dfff',
             500: '#00d9ff', // Primary brand cyan (Later Influence theme)
             600: '#00aed9',
             700: '#0082a3',
             800: '#00566d',
             900: '#002b36',
           },
         },
         boxShadow: {
           'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
           'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
         }
       },
     },
     plugins: [],
   }