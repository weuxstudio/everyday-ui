// Builds the Svelte demo with esbuild + the Svelte compiler (no Vite needed) and Tailwind.
//   node packages/svelte/demo/build.mjs     → packages/svelte/demo/dist/index.html
import { build } from "esbuild";
import { compile } from "svelte/compiler";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "dist");
mkdirSync(out, { recursive: true });

const sveltePlugin = {
  name: "svelte",
  setup(b) {
    b.onLoad({ filter: /\.svelte$/ }, (args) => {
      const source = readFileSync(args.path, "utf8");
      // Svelte 5's compiler understands <script lang="ts"> type annotations itself.
      const { js, warnings } = compile(source, { filename: relative(process.cwd(), args.path), generate: "client", css: "external", dev: false });
      for (const w of warnings) console.warn(`svelte: ${w.filename}: ${w.message}`);
      return { contents: js.code, loader: "js", resolveDir: dirname(args.path) };
    });
  },
};

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
