/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode with 'class' strategy
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure your React files are scanned
  ],
  theme: {
    extend: {
      colors: {
        // Optional: Your custom futuristic theme colors
        futuristicBlack: "#0A0F1C",
        neonBlue: "#00BFFF",
      },
    },
  },
  plugins: [],
}
