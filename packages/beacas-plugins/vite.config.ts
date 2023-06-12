import { defineConfig } from "vite";
import path from "path";
import svgr from "vite-plugin-svgr";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default defineConfig({
  resolve: {
    alias: {
      "beacas-core": path.resolve(__dirname, "../beacas-core"),
      "beacas-editor": path.resolve(__dirname, "../beacas-editor"),
      "@beacas-plugins": path.resolve(__dirname, "./src"),
    },
  },
  define: {},
  build: {
    emptyOutDir: true,
    minify: false,
    manifest: false,
    sourcemap: false,
    target: "es2015",
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "beacas-plugins",
      formats: ["es"],
      fileName: (mod) => `index.js`,
    },
    rollupOptions: {
      plugins: [],
      external: [
        "react",
        "react-dom",
        "react-dom/server",
        "mjml-browser",
        "lodash",
        "beacas-core",
        "beacas-editor",
        "slate",
        "slate-react",
        "slate-history",
        "@arco-design/web-react",
        "@arco-design/web-react/icon",
      ],
      output: {},
    },
    outDir: "lib",
  },
  optimizeDeps: {
    include: [],
  },
  plugins: [svgr({ exportAsDefault: false }), monacoEditorPlugin({})] as any,
});
