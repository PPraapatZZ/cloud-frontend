import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Swap BASE_URL เป็น backend จริงตอน connect API
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});