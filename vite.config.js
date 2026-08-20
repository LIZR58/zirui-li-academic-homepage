import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const excludedAssetDirs = new Set(["certificates", "papers"]);

function copyDirectory(source, destination, depth = 0) {
  mkdirSync(destination, { recursive: true });

  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (depth === 0 && excludedAssetDirs.has(entry.name)) {
      continue;
    }

    const sourcePath = resolve(source, entry.name);
    const destinationPath = resolve(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath, depth + 1);
    } else if (entry.isFile()) {
      cpSync(sourcePath, destinationPath);
    }
  }
}

function copyStaticResources() {
  return {
    name: "copy-static-resources",
    closeBundle() {
      const root = __dirname;
      const outDir = resolve(root, "dist");

      for (const dir of ["assets", "js", "css", "research"]) {
        const source = resolve(root, dir);
        if (existsSync(source)) {
          copyDirectory(source, resolve(outDir, dir));
        }
      }

      for (const file of [".nojekyll"]) {
        const source = resolve(root, file);
        if (existsSync(source)) {
          cpSync(source, resolve(outDir, file));
        }
      }

      writeFileSync(
        resolve(outDir, "index.js"),
        "export default { fetch(request, env) { return env.ASSETS.fetch(request); } };\n"
      );
    }
  };
}

export default defineConfig({
  base: "./",
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
