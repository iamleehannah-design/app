import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

function sitesBuildArtifacts() {
  let root = process.cwd();

  return {
    name: "sites-build-artifacts",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist", ".openai");
      const serverDirectory = resolve(root, "dist", "server");
      const hostingConfig = resolve(root, ".openai", "hosting.json");
      const workerSource = resolve(root, "worker", "index.js");

      await rm(outputDirectory, { recursive: true, force: true });
      await mkdir(outputDirectory, { recursive: true });
      await mkdir(serverDirectory, { recursive: true });

      if (await exists(hostingConfig)) {
        await cp(hostingConfig, resolve(outputDirectory, "hosting.json"));
      }

      if (!(await exists(workerSource))) {
        throw new Error("Missing worker/index.js for Sites deployment.");
      }

      await cp(workerSource, resolve(serverDirectory, "index.js"));
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), sitesBuildArtifacts()],
});
