// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
//   corePlugins: {
//     // Ngăn Tailwind tạo ra overflow issues
//     container: false,
//   },
//   // Thêm base styles để fix layout shifting
//   base: {
//     "html, body": {
//       "overflow-x": "hidden",
//       "max-width": "100vw",
//     },
//   },
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    // Plugin để ẩn scrollbar
    function ({ addUtilities }) {
      addUtilities({
        // Ẩn scrollbar hoàn toàn
        ".hide-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        // Scrollbar mỏng
        ".thin-scrollbar": {
          "scrollbar-width": "thin",
          "scrollbar-color": "#cbd5e1 #f8fafc",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f8fafc",
            "border-radius": "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#cbd5e1",
            "border-radius": "4px",
            transition: "background 0.2s ease",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#94a3b8",
          },
        },
        // Scrollbar mỏng cho dark mode
        ".dark .thin-scrollbar": {
          "scrollbar-color": "#6b7280 #374151",
          "&::-webkit-scrollbar-track": {
            background: "#374151",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#6b7280",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#9ca3af",
          },
        },
        // Scrollbar cực mỏng (3px)
        ".ultra-thin-scrollbar": {
          "&::-webkit-scrollbar": {
            width: "3px",
            height: "3px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0, 0, 0, 0.2)",
            "border-radius": "2px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0, 0, 0, 0.4)",
          },
        },
        // Dark mode cho ultra-thin-scrollbar
        ".dark .ultra-thin-scrollbar": {
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.2)",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(255, 255, 255, 0.4)",
          },
        },
        // Scrollbar chỉ hiện khi hover
        ".hover-scrollbar": {
          "&::-webkit-scrollbar": {
            width: "0px",
            transition: "width 0.2s ease",
          },
          "&:hover::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#cbd5e1",
            "border-radius": "4px",
          },
        },
      });
    },
  ],
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
