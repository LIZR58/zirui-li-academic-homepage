import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function copyStaticResources() {
  return {
    name: "copy-static-resources",
    closeBundle() {
      const root = __dirname;
      const outDir = resolve(root, "dist");

      for (const dir of ["assets", "js"]) {
        const source = resolve(root, dir);
        if (existsSync(source)) {
          cpSync(source, resolve(outDir, dir), { recursive: true });
        }
      }

      for (const file of [".nojekyll"]) {
        const source = resolve(root, file);
        if (existsSync(source)) {
          cpSync(source, resolve(outDir, file));
        }
      }
    }
  };
}

export default defineConfig({
  appType: "mpa",
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "index.html")
    }
  },
  plugins: [copyStaticResources()]
});
