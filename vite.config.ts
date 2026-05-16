import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-expect-error: vite-plugin-eslint 缺少类型定义
import eslint from "vite-plugin-eslint";
import path from "path";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  base: "/ai-agent-react/",
  server: {
    port: 3000,
  },
  plugins: [
    react({}),
    eslint({
      failOnError: false,  // 不阻塞开发
      include: ["src/**/*.{js,jsx,ts,tsx}"],
    }),
    checker({
      typescript: {
        tsconfigPath: "./tsconfig.app.json",
      },
      enableBuild: true,
      terminal: true,
    }),
  ],
  css: { preprocessorOptions: { scss: {} } },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
