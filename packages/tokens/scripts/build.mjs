// Default build: src/tokens.json → dist/, every preset → dist/themes/<name>/,
// then copies the CSS and the theme generator into the skill so it works without npm.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildTokens, formatContrast } from "../lib/build.mjs";
import { listPresets, themeFromKnobs } from "../lib/theme.mjs";
import { specimenHtml } from "../lib/specimen.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const report = process.argv.includes("--report");
let failed = 0;

// 1. Default tokens
const src = JSON.parse(readFileSync(join(root, "src/tokens.json"), "utf8"));
const base = buildTokens(src, join(root, "dist"), { source: "src/tokens.json" });
if (report || base.failed.length) console.log(formatContrast(base));
if (base.gamut.length) console.warn(`warning: outside sRGB gamut: ${base.gamut.join(", ")}`);
console.log(`default tokens → dist/ · contrast ${base.results.length - base.failed.length}/${base.results.length}`);
failed += base.failed.length;

// 2. Presets
for (const { name } of listPresets()) {
  const { tokens, knobs, notes, fonts } = themeFromKnobs({ preset: name });
  const out = join(root, "dist/themes", name);
  const c = buildTokens(tokens, out, { source: `presets/${name}.json` });
  writeFileSync(join(out, "theme.tokens.json"), JSON.stringify(tokens, null, 2) + "\n");
  writeFileSync(join(out, "specimen.html"), specimenHtml({ name, knobs, fonts, notes, contrast: c }));
  if (c.failed.length) console.log(formatContrast(c));
  console.log(`preset ${name.padEnd(10)} → dist/themes/${name}/ · contrast ${c.results.length - c.failed.length}/${c.results.length}`);
  failed += c.failed.length;
}
if (failed) process.exit(1);

// 3. Ship CSS and the generator inside the skill (zero dependencies, runs with plain node)
const skill = join(root, "../../skills/everyday-ui");
mkdirSync(join(skill, "assets"), { recursive: true });
for (const f of ["tokens.css", "base.css", "tailwind.css"]) cpSync(join(root, "dist", f), join(skill, "assets", f));
const gen = join(skill, "theme-generator");
rmSync(gen, { recursive: true, force: true });
for (const dir of ["lib", "bin", "presets"]) cpSync(join(root, dir), join(gen, dir), { recursive: true });
mkdirSync(join(gen, "src"), { recursive: true });
cpSync(join(root, "src/tokens.json"), join(gen, "src/tokens.json"));
writeFileSync(join(gen, "package.json"), JSON.stringify({ type: "module", private: true }, null, 2) + "\n");
console.log("skill assets and theme generator updated");
