/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pawpal: {
          dark: '#09090b',
          gray: '#10b981',
          wheat: '#6ee7b7',
          overlay: 'rgba(9,9,11,0.7)',
        },
        brand: {
          50: '#ecfdf5',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', '"Open Sans"', '"Helvetica Neue"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 8px 30px rgba(16,185,129,0.15)',
      },
    },
  },
  plugins: [],
}
