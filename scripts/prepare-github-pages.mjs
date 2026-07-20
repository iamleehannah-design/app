import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const sourceDir = resolve(root, process.argv[2] || "dist");
const outputDir = resolve(root, process.argv[3] || ".github-pages-site");

async function copyStaticBuild() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === ".openai" || entry.name === "server") {
      continue;
    }

    await cp(resolve(sourceDir, entry.name), resolve(outputDir, entry.name), {
      recursive: true,
    });
  }

  await writeFile(resolve(outputDir, ".nojekyll"), "");
}

copyStaticBuild().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
