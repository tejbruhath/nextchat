/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'whatsapp-green': '#25D366',
        'whatsapp-teal': '#075E54',
        'whatsapp-light': '#DCF8C6',
      }
    },
  },
  plugins: [],
}
