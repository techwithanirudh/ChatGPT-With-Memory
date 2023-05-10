/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // gray: {
        //   50: "#f7f7f8",
        //   100: "#ececf1",
        //   200: "#d9d9e3",
        //   300: "#c5c5d2",
        //   400: "#acacbe",
        //   500: "#8e8ea0",
        //   600: "#565869",
        //   700: "#40414f",
        //   800: "#343541",
        //   900: "#202123",
        //   1000: "#444654",
        // },
        gray: {
          50: "#f5f7fa",
          100: "#e9eff6",
          200: "#c8d8e9",
          300: "#a7c0dc",
          400: "#6f9ed0",
          500: "#1d7fd5",
          600: "#1565a8",
          700: "#0f4b7a",
          800: "#0a3b5c",
          900: "#08304b",
          1000: "#08304b",
        },
        green: {
          50: "#f1f9f7",
          100: "#def2ed",
          200: "#a6e5d6",
          300: "#6dc8b9",
          400: "#41a79d",
          500: "#1d8c83",
          600: "#126e6b",
          700: "#0a4f53",
          800: "#06373e",
          900: "#031f29",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
