/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./containers/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#374d65",
          light: "#5c6f87",
          lighter: "#8493a6",
          lightest: "#adb9c6"
        },
        secondary: {
          DEFAULT: "#fd7014",
          light: "#ff8f47",
          lighter: "#ffae7a",
          lightest: "#ffcfad"
        },
        white: "#ffffff",
        accent: {
          DEFAULT: "#496686",
          light: "#7092a8",
          lighter: "#98b0c9",
          lightest: "#c1d0eb",
          bg: "#EDEFF2"
        },
        dark: {
          DEFAULT: "#253444",
          light: "#435160",
          lighter: "#607082",
          lightest: "#7e90a4"
        },
        highlight: {
          DEFAULT: "#fd8f47",
          light: "#ffae7a",
          lighter: "#ffcfad",
          lightest: "#ffefde"
        },
        gray: {
          light: "#D5D5D5",
          lighter: "#E8E8E8",
          lightest: "#F5F5F5",
        },
        third: "#1DCC79"
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
