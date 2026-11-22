// Builds the Svelte demo with esbuild + the Svelte compiler (no Vite needed) and Tailwind.
//   node packages/svelte/demo/build.mjs     → packages/svelte/demo/dist/index.html
import { build } from "esbuild";
import { sveltePlugin } from "../../../scripts/svelte-esbuild.mjs";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "dist");
mkdirSync(out, { recursive: true });

await build({
  entryPoints: [join(here, "main.ts")],
  bundle: true,
  format: "esm",
  minify: true,
  outfile: join(out, "demo.js"),
  conditions: ["svelte", "browser"],
  plugins: [sveltePlugin],
  logLevel: "warning",
});
execSync(`npx @tailwindcss/cli -i ${join(here, "demo.css")} -o ${join(out, "demo.css")} --minify`, { stdio: "inherit" });
writeFileSync(
  join(out, "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Everyday UI · Svelte</title><link rel="stylesheet" href="demo.css"></head><body><div id="app"></div><script type="module" src="demo.js"></script></body></html>`,
);
console.log("svelte demo built:", join(out, "index.html"));
