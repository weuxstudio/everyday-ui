import { compile } from "svelte/compiler";
import { readFileSync } from "node:fs";
import { dirname, relative } from "node:path";

export const sveltePlugin = {
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
