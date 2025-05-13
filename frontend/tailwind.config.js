/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#8D8D8D", // Text color
        border: "#E2E2E2", // Border color
        background: "#FFFFFF", // Background color
        accent: "#115EA6", // Primary accent color
        accentHover: "#1066B7", // Accent color on hover
        black: "#191919", // General black
      },

      fontFamily: {
        "clemente-light": ["clemente_light", "sans-serif"],
        "clemente-regular": ["clemente_regular", "sans-serif"],
        "clemente-semibold": ["clemente_semibold", "sans-serif"],
        "clemente-bold": ["clemente_bold", "sans-serif"],
        "clemente-book": ["clemente_book", "sans-serif"],
        "gilroy-light": ["gilroy_light", "sans-serif"],
        "gilroy-regular": ["gilroy_regular", "sans-serif"],
        "gilroy-medium": ["gilroy_medium", "sans-serif"],
        "gilroy-semibold": ["gilroy_semibold", "sans-serif"],
        "gilroy-bold": ["gilroy_bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
