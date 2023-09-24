/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "375px",
        xtraLarge: { min: "1920px" },
        medium: { min: "1108px", max: "1919px" },
      },
      colors: {
        tsuka: {
          50: "#BBC3D7",
          100: "#828AA0",
          200: "#676F84",
          300: "#4D556A",
          400: "#343C4F",
          500: "#1F2333",
          600: "#191C29",
          700: "#13151F",
        },
        "custom-primary": "#E88326",
        "custom-red": "#EB5757",
        "custom-green": "#6FCF97",
        "custom-blue": "#56CCF2",
        accent: "#E88326",
      },
    },
    fontFamily: {
      "Gilroy-300": ["Gilroy-Light", "mono"],
      "Gilroy-400": ["Gilroy", "mono"],
      "Gilroy-500": ["Gilroy-Medium", "mono"],
      "Gilroy-600": ["Gilroy-SemiBold", "mono"],
      "Gilroy-700": ["Gilroy-Bold", "mono"],
      "Gilroy-800": ["Gilroy-ExtraBold", "mono"],

      "Inter-300": ["Inter-Light", "sans-serif"],
      "Inter-400": ["Inter", "sans-serif"],
      "Inter-500": ["Inter-Medium", "sans-serif"],
      "Inter-600": ["Inter-SemiBold", "sans-serif"],
      "Inter-700": ["Inter-Bold", "sans-serif"],
      "Inter-800": ["Inter-ExtraBold", "sans-serif"],

      "Steradian-300": ["Steradian-Light", "sans-serif"],
      "Steradian-400": ["Steradian", "sans-serif"],
      "Steradian-500": ["Steradian-Medium", "sans-serif"],
      // "Steradian-600": ['Steradian-SemiBold', 'sans-serif'],
      "Steradian-600": ["Steradian-Bold", "sans-serif"],
      "Steradian-700": ["Steradian-ExtraBold", "sans-serif"],
      Uruloki: ["Uruloki", "sans-serif"],

      "Poppins-300": ["Poppins", "sans-serif"],
    },
  },
  purge: {
    content: ['./src/**/*.js', './src/**/*.jsx', './src/**/*.ts', './src/**/*.tsx'],
    options: {
      safelist: [
        'bg-[#1F2333]', 
      ],
    },
  },
  plugins: [],
};
