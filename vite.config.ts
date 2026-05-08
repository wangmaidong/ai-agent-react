import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// @ts-expect-error - No type definitions for vite-plugin-eslint
import eslint from "vite-plugin-eslint";

// https://vite.dev/config/
export default defineConfig({
  base: "/ai-agent-react/",
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    eslint({
      failOnError: false,  // 不阻塞开发
      include: ["src/**/*.{js,jsx,ts,tsx}"],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
