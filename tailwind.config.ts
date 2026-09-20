import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors derived from logo and hero image
        primary: {
          teal: '#1DA599',
          mint: '#5DD4B8',
          navy: '#0F3C5C',
          'navy-dark': '#082338',
        },
        accent: {
          coral: '#FF8B6D',
          orange: '#FF9F6D',
        },
        neutral: {
          light: '#F5F9F8',
          gray: '#6B7280',
          dark: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bengali: ['Noto Sans Bengali', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
