// Builds tokens.json into CSS variables, a Tailwind v4 theme and a JS export,
// then checks WCAG contrast for every pairing the components rely on.
// Zero dependencies on purpose: the token pipeline must outlive any framework.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = JSON.parse(readFileSync(join(root, "src/tokens.json"), "utf8"));
const out = join(root, "dist");
mkdirSync(out, { recursive: true });

const PREFIX = "eu";
const darkOf = (t) => t?.$extensions?.["everyday-ui"]?.dark;
const isToken = (n) => n && typeof n === "object" && "$value" in n;
const entries = (group) => Object.entries(group).filter(([k]) => !k.startsWith("$"));
const fmt = (v) => (Array.isArray(v) ? v.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", ") : String(v));
const bezier = (v) => `cubic-bezier(${v.join(", ")})`;

// ---- collect variables ---------------------------------------------------
const light = []; // [name, value]
const dark = [];
const flat = {};
const add = (name, value, darkValue) => {
  light.push([name, value]);
  if (darkValue !== undefined) dark.push([name, darkValue]);
  flat[name] = darkValue !== undefined ? { light: value, dark: darkValue } : value;
};

for (const [k, t] of entries(src.color)) add(`color-${k}`, t.$value, darkOf(t));
for (const [k, t] of entries(src.font.family)) add(`font-${k}`, fmt(t.$value));
for (const [k, t] of entries(src.font.weight)) add(`font-weight-${k}`, String(t.$value));
for (const [k, t] of entries(src.text)) {
  add(`text-${k}`, t.size.$value);
  add(`text-${k}-line`, String(t.line.$value));
  add(`text-${k}-tracking`, t.tracking.$value);
}
add("space-unit", src.space.unit.$value);
for (const [k, t] of entries(src.size)) add(`size-${k}`, t.$value);
for (const [k, t] of entries(src.radius)) add(`radius-${k}`, t.$value);
for (const [k, t] of entries(src.shadow)) add(`shadow-${k}`, t.$value, darkOf(t));
for (const [k, t] of entries(src.motion.duration)) add(`duration-${k}`, t.$value);
for (const [k, t] of entries(src.motion.ease)) add(`ease-${k}`, bezier(t.$value));

const decl = (list, indent = "  ") => list.map(([n, v]) => `${indent}--${PREFIX}-${n}: ${v};`).join("\n");

// ---- tokens.css ------------------------------------------------------------
const durations = entries(src.motion.duration).map(([k]) => [`duration-${k}`, "0ms"]);
const tokensCss = `/* Everyday UI tokens - generated from src/tokens.json. Do not edit. */
:root {
  color-scheme: light;
${decl(light)}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${decl(dark, "    ")}
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;
${decl(dark)}
}

@media (prefers-reduced-motion: reduce) {
  :root {
${decl(durations, "    ")}
  }
}
`;
writeFileSync(join(out, "tokens.css"), tokensCss);

// ---- base.css (framework-agnostic defaults) ---------------------------------
const baseCss = `/* Everyday UI base - sensible document defaults built on the tokens. */
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
body {
  margin: 0;
  background: var(--${PREFIX}-color-paper);
  color: var(--${PREFIX}-color-ink);
  font-family: var(--${PREFIX}-font-sans);
  font-size: var(--${PREFIX}-text-base);
  line-height: var(--${PREFIX}-text-base-line);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
h1, h2, h3, h4 { text-wrap: balance; }
p, li, figcaption { text-wrap: pretty; }
:focus-visible {
  outline: 2px solid var(--${PREFIX}-color-focus);
  outline-offset: 2px;
}
::selection { background: var(--${PREFIX}-color-accent-subtle); }
`;
writeFileSync(join(out, "base.css"), baseCss);

// ---- tailwind.css (Tailwind v4 theme) ---------------------------------------
const v = (n) => `var(--${PREFIX}-${n})`;
const tw = [];
for (const [k] of entries(src.color)) tw.push(`--color-${k}: ${v(`color-${k}`)};`);
for (const [k] of entries(src.font.family)) tw.push(`--font-${k}: ${v(`font-${k}`)};`);
for (const [k] of entries(src.font.weight)) tw.push(`--font-weight-${k}: ${v(`font-weight-${k}`)};`);
for (const [k] of entries(src.text)) {
  tw.push(`--text-${k}: ${v(`text-${k}`)};`);
  tw.push(`--text-${k}--line-height: ${v(`text-${k}-line`)};`);
  tw.push(`--text-${k}--letter-spacing: ${v(`text-${k}-tracking`)};`);
}
tw.push(`--spacing: ${v("space-unit")};`);
// Named sizes become spacing keys, so h-control-md, min-h-touch, max-w-measure work.
for (const [k] of entries(src.size)) tw.push(`--spacing-${k}: ${v(`size-${k}`)};`);
// Every transition-* utility uses the token motion by default.
tw.push(`--default-transition-duration: ${v("duration-fast")};`);
tw.push(`--default-transition-timing-function: ${v("ease-out")};`);
for (const [k] of entries(src.radius)) tw.push(`--radius-${k}: ${v(`radius-${k}`)};`);
for (const [k] of entries(src.shadow)) tw.push(`--shadow-${k}: ${v(`shadow-${k}`)};`);
for (const [k] of entries(src.motion.ease)) tw.push(`--ease-${k}: ${v(`ease-${k}`)};`);

const tailwindCss = `/* Everyday UI theme for Tailwind v4 - generated. Do not edit.
   Usage: @import "tailwindcss"; @import "@everyday-ui/tokens/tailwind.css"; */
@import "./tokens.css";

/* Remove Tailwind's default palette so only Everyday UI colors exist.
   A constraint, not a limitation: off-system colors become impossible to type. */
@theme {
  --color-*: initial;
  --color-white: oklch(1 0 0);
  --color-black: oklch(0 0 0);
}

@theme inline {
${tw.map((l) => "  " + l).join("\n")}
}

@layer base {
${baseCss.split("\n").filter((l) => !l.startsWith("/*")).map((l) => (l ? "  " + l : l)).join("\n")}
}
`;
writeFileSync(join(out, "tailwind.css"), tailwindCss);

// ---- JS export ----------------------------------------------------------------
writeFileSync(join(out, "tokens.json"), JSON.stringify(flat, null, 2) + "\n");
writeFileSync(join(out, "index.js"), `// generated\nexport const tokens = ${JSON.stringify(flat, null, 2)};\nexport const cssVar = (name) => \`var(--${PREFIX}-\${name})\`;\n`);
writeFileSync(
  join(out, "index.d.ts"),
  `// generated\nexport type TokenName = ${Object.keys(flat).map((k) => JSON.stringify(k)).join(" | ")};\nexport declare const tokens: Record<TokenName, string | { light: string; dark: string }>;\nexport declare function cssVar(name: TokenName): string;\n`
);

// ---- contrast check ---------------------------------------------------------
function oklchToLinearRgb(str) {
  const m = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!m) throw new Error(`Cannot parse color ${str}`);
  const [L, C, H] = m.slice(1).map(Number);
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s,
  ];
}
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => Math.min(1, Math.max(0, c)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (fg, bg) => {
  const [a, b] = [luminance(oklchToLinearRgb(fg)), luminance(oklchToLinearRgb(bg))];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const TEXT = 4.5, UI = 3;
const pairs = [
  ["ink", "paper", TEXT], ["ink", "surface", TEXT], ["ink", "sunken", TEXT],
  ["ink-muted", "paper", TEXT], ["ink-muted", "surface", TEXT], ["ink-muted", "sunken", TEXT],
  ["ink", "accent-subtle", TEXT], ["accent", "accent-subtle", TEXT],
  ["accent", "paper", TEXT], ["accent", "surface", TEXT],
  ["accent-ink", "accent", TEXT], ["accent-ink", "accent-hover", TEXT],
  ["danger", "paper", TEXT], ["danger", "surface", TEXT], ["danger-ink", "danger", TEXT], ["danger-ink", "danger-hover", TEXT], ["danger", "danger-subtle", TEXT],
  ["success", "paper", TEXT], ["success", "success-subtle", TEXT],
  ["warning", "paper", TEXT], ["warning", "warning-subtle", TEXT],
  ["border-strong", "paper", UI], ["border-strong", "surface", UI],
  ["focus", "paper", UI], ["focus", "surface", UI],
];

const colors = Object.fromEntries(entries(src.color).map(([k, t]) => [k, { light: t.$value, dark: darkOf(t) }]));
let failed = 0;
const rows = [];
for (const mode of ["light", "dark"]) {
  for (const [fg, bg, min] of pairs) {
    const ratio = contrast(colors[fg][mode], colors[bg][mode]);
    const ok = ratio >= min;
    if (!ok) failed++;
    rows.push(`${ok ? "pass" : "FAIL"}  ${mode.padEnd(5)}  ${fg.padEnd(14)} on ${bg.padEnd(14)} ${ratio.toFixed(2).padStart(5)} (min ${min})`);
  }
}
// sRGB gamut warning
const gamut = [];
for (const [k, c] of Object.entries(colors))
  for (const mode of ["light", "dark"]) {
    const rgb = oklchToLinearRgb(c[mode]);
    if (rgb.some((x) => x < -0.002 || x > 1.002)) gamut.push(`${k} (${mode})`);
  }

const verbose = process.argv.includes("--report");
if (verbose || failed) console.log(rows.join("\n"));
if (gamut.length) console.warn(`warning: outside sRGB gamut (will be clipped on sRGB screens): ${gamut.join(", ")}`);
console.log(`tokens built → dist/ · contrast: ${rows.length - failed}/${rows.length} pairs pass`);
if (failed) process.exit(1);

// ---- copy CSS into the skill, so the skill works standalone (without npm) ----
const skillAssets = join(root, "../../skills/everyday-ui/assets");
mkdirSync(skillAssets, { recursive: true });
for (const f of ["tokens.css", "base.css", "tailwind.css"]) writeFileSync(join(skillAssets, f), readFileSync(join(out, f)));
