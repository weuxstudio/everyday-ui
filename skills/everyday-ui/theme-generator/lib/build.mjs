// Turns a token tree (W3C DTCG format) into CSS variables, a Tailwind v4 theme,
// base styles and a JS export, and checks every color pairing for contrast.
// Used by the default build and by the theme generator.

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { apca, composite, inGamut, parseOklch, wcag } from "./color.mjs";

export const PREFIX = "eu";
const darkOf = (t) => t?.$extensions?.["everyday-ui"]?.dark;
const entries = (group = {}) => Object.entries(group).filter(([k]) => !k.startsWith("$"));
const fmt = (v) => (Array.isArray(v) ? v.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(", ") : String(v));
const bezier = (v) => `cubic-bezier(${v.join(", ")})`;
const SQUIRCLE_FACTOR = 1.8; // a squircle with the same radius reads smaller; compensate

// ---------------------------------------------------------------------------
// Contrast rules
// ---------------------------------------------------------------------------

/** role → [WCAG minimum, APCA minimum (Lc), APCA preferred] */
export const ROLE = {
  body: [4.5, 75, 90],
  secondary: [4.5, 60, 75],
  ui: [3, 45, 60],
};
/** "high" contrast themes require the preferred levels. */
const ROLE_HIGH = {
  body: [7, 90, 90],
  secondary: [4.5, 75, 75],
  ui: [3, 60, 60],
};

export const PAIRS = [
  ["ink", "paper", "body"], ["ink", "surface", "body"], ["ink", "sunken", "body"], ["ink", "accent-subtle", "body"],
  ["ink-muted", "paper", "secondary"], ["ink-muted", "surface", "secondary"], ["ink-muted", "sunken", "secondary"],
  ["accent", "paper", "secondary"], ["accent", "surface", "secondary"], ["accent", "accent-subtle", "secondary"],
  ["accent-ink", "accent", "secondary"], ["accent-ink", "accent-hover", "secondary"],
  ["danger", "paper", "secondary"], ["danger", "surface", "secondary"], ["danger", "danger-subtle", "secondary"], ["ink", "danger-subtle", "body"],
  ["danger-ink", "danger", "secondary"], ["danger-ink", "danger-hover", "secondary"],
  ["success", "paper", "secondary"], ["success", "success-subtle", "secondary"],
  ["warning", "paper", "secondary"], ["warning", "warning-subtle", "secondary"],
  ["border-strong", "paper", "ui"], ["border-strong", "surface", "ui"],
  ["focus", "paper", "ui"], ["focus", "surface", "ui"],
  // Floating surfaces (dialogs, menus). If translucent ("glass"), checked over the worst backdrop.
  ["ink", "overlay", "body"], ["ink-muted", "overlay", "secondary"], ["accent", "overlay", "secondary"],
];

export function colorTable(src) {
  return Object.fromEntries(entries(src.color).map(([k, t]) => [k, { light: t.$value, dark: darkOf(t) ?? t.$value }]));
}

/**
 * Resolve a background for checks. Translucent ("glass") surfaces are composited over the
 * worst plausible backdrops: the page itself, and page content as the backdrop blur renders it
 * (fine detail like text averages out, modeled as paper and ink mixed half and half). Glass over
 * full-bleed photography needs its own scrim; the skill says so.
 */
function backdrops(colors, bg, mode, blurred) {
  const c = parseOklch(colors[bg][mode]);
  if (c.alpha >= 1) return [[bg, colors[bg][mode]]];
  const paper = colors.paper[mode];
  const ink = parseOklch(colors.ink[mode]);
  const content = blurred ? composite({ ...ink, alpha: 0.5 }, paper) : colors.ink[mode];
  return [
    [`${bg} over paper`, composite(c, paper)],
    [`${bg} over ${blurred ? "blurred content" : "ink"}`, composite(c, content)],
  ];
}

export function checkContrast(src) {
  const colors = colorTable(src);
  const level = src.$extensions?.["everyday-ui"]?.contrast === "high" ? ROLE_HIGH : ROLE;
  const blurred = parseFloat(src.effect?.["overlay-blur"]?.$value ?? "0") >= 16;
  const results = [];
  for (const mode of ["light", "dark"]) {
    for (const [fg, bg, role] of PAIRS) {
      if (!colors[fg] || !colors[bg]) continue;
      const [wMin, aMin, aPref] = level[role];
      for (const [bgLabel, bgColor] of backdrops(colors, bg, mode, blurred)) {
        const ratio = wcag(colors[fg][mode], bgColor);
        const lc = apca(colors[fg][mode], bgColor);
        results.push({ mode, fg, bg, bgLabel, role, ratio, lc, wMin, aMin, aPref, ok: ratio >= wMin && lc >= aMin });
      }
    }
  }
  const gamut = [];
  for (const [k, c] of Object.entries(colors))
    for (const mode of ["light", "dark"]) if (!inGamut(c[mode])) gamut.push(`${k} (${mode})`);
  return { results, failed: results.filter((r) => !r.ok), gamut };
}

export function formatContrast({ results }) {
  return results
    .map(
      (r) =>
        `${r.ok ? "pass" : "FAIL"}  ${r.mode.padEnd(5)}  ${r.fg.padEnd(14)} on ${r.bgLabel.padEnd(22)} ` +
        `WCAG ${r.ratio.toFixed(2).padStart(5)} (≥${r.wMin})  APCA Lc ${r.lc.toFixed(0).padStart(3)} (≥${r.aMin})  ${r.role}`,
    )
    .join("\n");
}

// ---------------------------------------------------------------------------
// CSS generation
// ---------------------------------------------------------------------------

function collect(src) {
  const light = [];
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
  for (const [k, t] of entries(src.space)) add(`space-${k}`, t.$value);
  for (const [k, t] of entries(src.size)) add(`size-${k}`, t.$value);
  for (const [k, t] of entries(src.radius)) add(`radius-${k}`, t.$value);
  for (const [k, t] of entries(src.shadow)) add(`shadow-${k}`, t.$value, darkOf(t));
  for (const [k, t] of entries(src.effect)) add(`effect-${k}`, t.$value);
  for (const [k, t] of entries(src.motion.duration)) add(`duration-${k}`, t.$value);
  for (const [k, t] of entries(src.motion.ease)) add(`ease-${k}`, bezier(t.$value));
  for (const [k, t] of entries(src.motion.spring)) add(`spring-${k}`, String(t.$value));
  if (src.motion.distance) add("motion-distance", src.motion.distance.$value);
  return { light, dark, flat };
}

const decl = (list, indent = "  ") => list.map(([n, v]) => `${indent}--${PREFIX}-${n}: ${v};`).join("\n");

function scaleLength(value, factor) {
  const m = String(value).match(/^([\d.]+)(rem|px)$/);
  if (!m || +m[1] >= 999) return value;
  return `${+(+m[1] * factor).toFixed(4)}${m[2]}`;
}

export function tokensCss(src, { source = "tokens.json" } = {}) {
  const { light, dark } = collect(src);
  const mode = src.$extensions?.["everyday-ui"]?.defaultMode ?? "system";
  const darkNames = new Set(dark.map(([n]) => n));
  const lightSubset = light.filter(([n]) => darkNames.has(n));
  const durations = [...entries(src.motion.duration).map(([k]) => [`duration-${k}`, "0ms"]), ["motion-distance", "0px"], ["spring-bounce", "0"]];

  let modeCss;
  if (mode === "dark") {
    modeCss = `:root:not([data-theme="light"]), [data-theme="dark"] {\n  color-scheme: dark;\n${decl(dark)}\n}\n\n[data-theme="light"] {\n  color-scheme: light;\n${decl(lightSubset)}\n}`;
  } else if (mode === "light") {
    modeCss = `[data-theme="light"] {\n  color-scheme: light;\n${decl(lightSubset)}\n}\n\n[data-theme="dark"] {\n  color-scheme: dark;\n${decl(dark)}\n}`;
  } else {
    modeCss = `[data-theme="light"] {\n  color-scheme: light;\n${decl(lightSubset)}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n    color-scheme: dark;\n${decl(dark, "    ")}\n  }\n}\n\n[data-theme="dark"] {\n  color-scheme: dark;\n${decl(dark)}\n}`;
  }

  let squircle = "";
  if (src.shape?.corner?.$value === "squircle") {
    const radii = entries(src.radius).map(([k, t]) => [`radius-${k}`, scaleLength(t.$value, SQUIRCLE_FACTOR)]);
    squircle = `\n\n/* Squircle corners where supported; radii are enlarged because a squircle of the same
   radius looks smaller. Browsers without support keep regular rounded corners. */
@supports (corner-shape: squircle) {
  :root {
${decl(radii, "    ")}
  }
  :root { --${PREFIX}-corner-shape: squircle; }
}`;
  }

  return `/* Everyday UI tokens - generated from ${source}. Do not edit by hand. */
:root {
  color-scheme: ${mode === "dark" ? "dark" : "light"};
${decl(light)}
}

${modeCss}

@media (prefers-reduced-motion: reduce) {
  :root {
${decl(durations, "    ")}
  }
}

/* Translucent surfaces become solid for people who ask for less transparency. */
@media (prefers-reduced-transparency: reduce) {
  :root, [data-theme] {
    --${PREFIX}-color-overlay: var(--${PREFIX}-color-surface);
    --${PREFIX}-effect-overlay-blur: 0px;
  }
}${squircle}
`;
}

export const BASE_CSS = `/* Everyday UI base - sensible document defaults built on the tokens. */
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
h1, h2, h3, h4 {
  font-family: var(--${PREFIX}-font-display);
  font-weight: var(--${PREFIX}-font-weight-heading);
  text-wrap: balance;
}
p, li, figcaption { text-wrap: pretty; }
:focus-visible {
  outline: 2px solid var(--${PREFIX}-color-focus);
  outline-offset: 2px;
}
::selection { background: var(--${PREFIX}-color-accent-subtle); }
/* Corner shape follows the theme (round or squircle) on themed shapes only; circles stay circles. */
.rounded-control, .rounded-check, .rounded-card, .rounded-dialog { corner-shape: var(--${PREFIX}-corner-shape, round); }
/* Text links: accent colour AND underline, so they never rely on colour alone.
   Navigation, tabs and cards may opt out (they signal interactivity by shape). */
a {
  color: var(--${PREFIX}-color-accent);
  text-decoration-line: underline;
  text-decoration-thickness: from-font;
  text-underline-offset: 0.2em;
}
a:hover { color: var(--${PREFIX}-color-accent-hover); }
/* Numbers that get compared line up. */
table, [data-numeric] { font-variant-numeric: tabular-nums; }
`;

export function tailwindCss(src) {
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
  // Semantic spacing that themes control (density). T-shirt steps stay CSS-only to avoid
  // clashing with Tailwind's container names (max-w-xs etc.).
  if (src.space?.card) tw.push(`--spacing-card: ${v("space-card")};`);
  for (const [k] of entries(src.size)) tw.push(`--spacing-${k}: ${v(`size-${k}`)};`);
  tw.push(`--default-transition-duration: ${v("duration-fast")};`);
  tw.push(`--default-transition-timing-function: ${v("ease-out")};`);
  for (const [k] of entries(src.radius)) tw.push(`--radius-${k}: ${v(`radius-${k}`)};`);
  for (const [k] of entries(src.shadow)) tw.push(`--shadow-${k}: ${v(`shadow-${k}`)};`);
  if (src.effect?.["overlay-blur"]) tw.push(`--blur-overlay: ${v("effect-overlay-blur")};`);
  for (const [k] of entries(src.motion.ease)) tw.push(`--ease-${k}: ${v(`ease-${k}`)};`);

  return `/* Everyday UI theme for Tailwind v4 - generated. Do not edit by hand.
   Usage: @import "tailwindcss"; @import "<this file>"; */
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
${BASE_CSS.replace(/\/\*[\s\S]*?\*\//g, "").split("\n").filter((l) => l.trim()).map((l) => "  " + l).join("\n")}
}
`;
}

/** Writes tokens.css, base.css, tailwind.css, tokens.json, index.js, index.d.ts. Returns the contrast check. */
export function buildTokens(src, outDir, { source } = {}) {
  mkdirSync(outDir, { recursive: true });
  const { flat } = collect(src);
  writeFileSync(join(outDir, "tokens.css"), tokensCss(src, { source }));
  writeFileSync(join(outDir, "base.css"), BASE_CSS);
  writeFileSync(join(outDir, "tailwind.css"), tailwindCss(src));
  writeFileSync(join(outDir, "tokens.json"), JSON.stringify(flat, null, 2) + "\n");
  writeFileSync(
    join(outDir, "index.js"),
    `// generated\nexport const tokens = ${JSON.stringify(flat, null, 2)};\nexport const cssVar = (name) => \`var(--${PREFIX}-\${name})\`;\n`,
  );
  writeFileSync(
    join(outDir, "index.d.ts"),
    `// generated\nexport type TokenName = ${Object.keys(flat).map((k) => JSON.stringify(k)).join(" | ")};\nexport declare const tokens: Record<TokenName, string | { light: string; dark: string }>;\nexport declare function cssVar(name: TokenName): string;\n`,
  );
  return checkContrast(src);
}
