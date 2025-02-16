/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "2xl": "1536px",
        "3xl": "1920px", // Added 3xl for larger screens
      },
      colors: {
        colors: {
          primary: "#5E49D9",
          secondary: "#ffffff",
          textPrimary: "#161819",
          textSecondary: "#999999"
        },
        backgroundImage: {
          "gradient-primary":
            "radial-gradient(50% 50% at 50% 50%, rgba(176, 163, 255, 0.4) 0%, rgba(94, 73, 217, 0.4) 58.17%, rgba(58, 31, 218, 0.4) 100%)",
        },
      },
    },
  },
  plugins: [],
};
