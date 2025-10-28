// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // Cấu hình cho build
//   build: {
//     outDir: "dist",
//   },

//   // Cấu hình cho dev server - hỗ trợ client-side routing
//   server: {
//     historyApiFallback: true,
//   },

//   // Cấu hình cho preview mode
//   preview: {
//     historyApiFallback: true,
//   },
// });

// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
