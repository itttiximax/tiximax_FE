/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // Ngăn Tailwind tạo ra overflow issues
    container: false,
  },
  // Thêm base styles để fix layout shifting
  base: {
    "html, body": {
      "overflow-x": "hidden",
      "max-width": "100vw",
    },
  },
};
