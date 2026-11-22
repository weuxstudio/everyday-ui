#!/usr/bin/env node
// everyday-theme: create and fine-tune an Everyday UI theme from a few knobs.
//
//   everyday-theme presets                       list starting points
//   everyday-theme knobs                         list every knob and its values
//   everyday-theme init --preset editorial --accent "#1e5b4f" --name "Atlas" [--out src/styles/everyday]
//   everyday-theme build [--report]              generate CSS, Tailwind theme, specimen, THEME.md
//   everyday-theme set shape.radius round        change one knob and rebuild
//   everyday-theme set shape.radius +1           one step along an ordered knob (rounder, denser, ...)
//
// Options: --file <path> (default everyday.theme.json)

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildTokens, formatContrast } from "../lib/build.mjs";
import { KNOBS, ORDERED, get, listPresets, resolveKnobs, setPath, themeFromKnobs } from "../lib/theme.mjs";
import { specimenHtml } from "../lib/specimen.mjs";

const argv = process.argv.slice(2);
const cmd = argv[0];
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const flag = (name) => argv.includes(`--${name}`);
const file = resolve(opt("file", "everyday.theme.json"));

const parseValue = (raw) => {
  if (raw === "null") return null;
  if (raw === "true" || raw === "false") return raw === "true";
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  return raw;
};

function readTheme() {
  if (!existsSync(file)) {
    console.error(`No ${file}. Create one with: everyday-theme init --preset <name>`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(file, "utf8"));
}

function themeMd({ name, knobs, notes, fonts, contrast, outDir }) {
  const slug = (f) => f.toLowerCase().replace(/\s+/g, "-");
  const passed = contrast.results.length - contrast.failed.length;
  const row = (k) => `| \`${k}\` | ${JSON.stringify(k.split(".").reduce((o, p) => o?.[p], knobs) ?? null)} |`;
  return `# ${name} - Everyday UI theme

Generated from \`everyday.theme.json\`. Change knobs there (or with \`everyday-theme set\`) and rebuild;
never edit the generated CSS by hand.

## Knobs

| Knob | Value |
| --- | --- |
| \`preset\` | "${knobs.preset}" |
${Object.keys(KNOBS).map(row).join("\n")}

## Notes

${notes.length ? notes.map((n) => `- ${n}`).join("\n") : "- None."}

Contrast: **${passed}/${contrast.results.length}** checks pass (WCAG 2.2 AA and APCA, light and dark).

## Use it

\`\`\`css
/* app.css */
@import "tailwindcss";
@import "./${outDir}/tailwind.css";
\`\`\`

Without Tailwind: import \`${outDir}/tokens.css\` and \`${outDir}/base.css\`.

## Fonts

Self-host the fonts (recommended in the EU: loading Google Fonts from Google's servers sends
visitors' IP addresses to Google, which German courts have ruled needs consent):

\`\`\`bash
npm install ${fonts.map((f) => `@fontsource-variable/${slug(f)}`).join(" ")}
\`\`\`

\`\`\`js
${fonts.map((f) => `import "@fontsource-variable/${slug(f)}";`).join("\n")}
\`\`\`

If a font has no variable version, use \`@fontsource/<name>\` and import the weights you need
(400, 600${knobs.type?.headingWeight && ![400, 600].includes(knobs.type.headingWeight) ? `, ${knobs.type.headingWeight}` : ""}).
All fonts above are licensed under the SIL Open Font License.

Preview: open \`specimen.html\` (it loads fonts from Google for convenience).
`;
}

function build() {
  const input = readTheme();
  const outDir = opt("out", input.output ?? "everyday-theme");
  const absOut = resolve(outDir);
  const { tokens, knobs, notes, fonts } = themeFromKnobs(input);
  const name = input.name ?? knobs.preset;
  const contrast = buildTokens(tokens, absOut, { source: "everyday.theme.json" });
  writeFileSync(join(absOut, "theme.tokens.json"), JSON.stringify(tokens, null, 2) + "\n");
  writeFileSync(join(absOut, "specimen.html"), specimenHtml({ name, knobs, fonts, notes, contrast }));
  writeFileSync(join(absOut, "THEME.md"), themeMd({ name, knobs, notes, fonts, contrast, outDir }));
  if (flag("report") || contrast.failed.length) console.log(formatContrast(contrast));
  for (const n of notes) console.log(`note: ${n}`);
  console.log(`theme "${name}" → ${outDir}/ (tokens.css, tailwind.css, base.css, specimen.html, THEME.md)`);
  console.log(`contrast (WCAG 2.2 + APCA): ${contrast.results.length - contrast.failed.length}/${contrast.results.length} pass`);
  if (contrast.failed.length) process.exit(1);
}

process.on("uncaughtException", (e) => {
  console.error(e.message);
  process.exit(1);
});

switch (cmd) {
  case "presets":
    for (const p of listPresets()) console.log(`${p.name.padEnd(10)} ${p.description}`);
    break;
  case "knobs":
    for (const [k, v] of Object.entries(KNOBS)) console.log(`${k.padEnd(22)} ${v}`);
    break;
  case "init": {
    if (existsSync(file) && !flag("force")) {
      console.error(`${file} exists. Use --force to overwrite, or "everyday-theme set" to change it.`);
      process.exit(1);
    }
    const theme = { name: opt("name", "My product"), preset: opt("preset", "neutral"), output: opt("out", "everyday-theme") };
    if (opt("accent")) theme.color = { accent: opt("accent") };
    resolveKnobs(theme); // validates preset and values
    writeFileSync(file, JSON.stringify(theme, null, 2) + "\n");
    console.log(`created ${file} (preset ${theme.preset})`);
    build();
    break;
  }
  case "build":
    build();
    break;
  case "set": {
    const [path, raw] = [argv[1], argv[2]];
    if (!path || raw === undefined) {
      console.error("usage: everyday-theme set <knob> <value>   e.g. set shape.radius round");
      process.exit(1);
    }
    if (path !== "preset" && path !== "name" && path !== "output" && !KNOBS[path]) {
      console.error(`Unknown knob "${path}". Run "everyday-theme knobs" for the list.`);
      process.exit(1);
    }
    const theme = readTheme();
    let value = parseValue(raw);
    if (raw === "+1" || raw === "-1") {
      const order = ORDERED[path];
      if (!order) {
        console.error(`"${path}" has no order; give a value. Run "everyday-theme knobs".`);
        process.exit(1);
      }
      const current = get(resolveKnobs(theme), path);
      const i = Math.min(order.length - 1, Math.max(0, order.indexOf(current) + (raw === "+1" ? 1 : -1)));
      value = order[i];
      if (value === current) console.log(`${path} is already "${current}", the ${raw === "+1" ? "last" : "first"} step.`);
    }
    setPath(theme, path, value);
    resolveKnobs(theme);
    writeFileSync(file, JSON.stringify(theme, null, 2) + "\n");
    console.log(`set ${path} = ${JSON.stringify(value)}`);
    build();
    break;
  }
  default:
    console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 12).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
}

