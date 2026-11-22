// Copies the dependency-free CLIs into the skill, so they run with plain node where the skill is
// installed (no npm needed): skills/everyday-ui/tools/<name>/{bin,lib}.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tools = join(root, "skills/everyday-ui/tools");
for (const name of ["lint", "shots"]) {
  const src = join(root, "packages", name);
  if (!existsSync(src)) continue;
  const dest = join(tools, name);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  for (const part of ["bin", "lib", "README.md"]) if (existsSync(join(src, part))) cpSync(join(src, part), join(dest, part), { recursive: true });
}
console.log("skill tools updated");

// The component CSS (dialog and sheet transitions, .eu-enter, view transitions) is shared by the
// React and Svelte adapters. React's copy is the source.
const reactCss = readFileSync(join(root, "packages/react/src/styles.css"), "utf8");
const body = reactCss.replace(/^\/\*[\s\S]*?\*\/\s*/, "");
const header = `/* Import once in the app, after Tailwind and the tokens:
   @import "tailwindcss";
   @import "<theme>/tailwind.css";
   @import "@everyday-ui/svelte/styles.css";
   @source "../node_modules/@everyday-ui/svelte/src";
   Generated from packages/react/src/styles.css by scripts/sync-skill-tools.mjs; edit that file. */

`;
writeFileSync(join(root, "packages/svelte/src/styles.css"), header + body);
console.log("svelte styles.css synced");
