// Copies the dependency-free CLIs into the skill, so they run with plain node where the skill is
// installed (no npm needed): skills/everyday-ui/tools/<name>/{bin,lib}.
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
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
