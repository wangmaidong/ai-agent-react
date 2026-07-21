import { defineConfig } from "tsup";
import { sassPlugin } from "esbuild-sass-plugin";

export default defineConfig({
  entry: ["src/main.tsx"],
  format: ["esm"],
  // 是否生成类型声明文件，这里配置为false不生成。tsup生成的类型结构不好，
  // 我们这里用了类型声明扩展语法，不适合用tsup，我们用tsc
  dts: false,
  clean: true,
  outDir: "dist",
  tsconfig: "./tsconfig.app.json",
  external: [
    "react", "react-dom", "antd",
    "@ant-design/x", "react-router",
    "qs", "axios", "@peryl/utils",
    "lodash", "immer",
  ],
  esbuildPlugins: [
    sassPlugin({ type: "css" }),
  ],
});
