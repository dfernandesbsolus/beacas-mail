import { defineConfig } from "vite";
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  resolve: {
    alias: {
      "beacas-core": path.resolve(__dirname, "../beacas-core"),
      "@beacas-editor": path.resolve(__dirname, "./src"),
    },
  },
  define: {},
  build: {
    emptyOutDir: true,
    minify: true,
    manifest: false,
    sourcemap: false,
    target: "es2015",
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "beacas-editor",
      formats: ["es"],
      fileName: (mod) => `index.js`,
    },
    rollupOptions: {
      plugins: [],
      external: [
        "react",
        "react-dom",
        "react-dom/server",
        "mjml",
        "mjml-browser",
        "lodash",
        "slate",
        "slate-react",
        "slate-history",
        "beacas-core",
      ],
      output: {},
    },
    outDir: "lib",
  },
  optimizeDeps: {
    include: [],
  },
  plugins: [svgr({ exportAsDefault: false })],
});
