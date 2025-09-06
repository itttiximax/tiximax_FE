import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Cấu hình cho build
  build: {
    outDir: "dist",
  },

  // Cấu hình cho dev server - hỗ trợ client-side routing
  server: {
    historyApiFallback: true,
  },

  // Cấu hình cho preview mode
  preview: {
    historyApiFallback: true,
  },
});
