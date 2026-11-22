// Theme generator: a handful of human-sized knobs → a complete, contrast-checked token set.
// The rules (spacing steps, roles, contrast minimums) never change; only the look does.

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { fitGamut, formatOklch, parseColor, parseOklch } from "./color.mjs";
import { checkContrast } from "./build.mjs";

const here = dirname(fileURLToPath(import.meta.url));
export const DEFAULTS_PATH = join(here, "../src/tokens.json");
export const PRESETS_DIR = join(here, "../presets");

// ---------------------------------------------------------------------------
// Knob vocabulary (also used for validation and docs)
// ---------------------------------------------------------------------------

export const KNOBS = {
  "color.accent": "brand color as #hex or oklch(L C H); auto-corrected for contrast",
  "color.neutral": "warm | cool | neutral | brand | <hue 0-360>",
  "color.tint": "none | subtle | noticeable",
  "color.mode": "system | light | dark",
  "color.contrast": "standard | high",
  "type.sans": "UI and body typeface (family name)",
  "type.display": "heading typeface, or null for the same as sans",
  "type.displayStyle": "sans | serif",
  "type.mono": "monospace typeface",
  "type.scale": "compact | balanced | expressive | dramatic | <ratio 1.1-1.5>",
  "type.headingWeight": "400 | 500 | 600 | 700",
  "type.headingTracking": "normal | tight",
  "shape.radius": "none | sharp | subtle | soft | round | pill",
  "shape.corners": "round | squircle",
  "density": "compact | comfortable | spacious",
  "depth": "flat | subtle | soft | dramatic",
  "surface": "solid | layered | glass",
  "motion": "minimal | smooth | playful",
};

const ALLOWED = {
  "color.neutral": ["warm", "cool", "neutral", "brand"],
  "color.tint": ["none", "subtle", "noticeable"],
  "color.mode": ["system", "light", "dark"],
  "color.contrast": ["standard", "high"],
  "type.displayStyle": ["sans", "serif"],
  "type.scale": ["compact", "balanced", "expressive", "dramatic"],
  "type.headingTracking": ["normal", "tight"],
  "shape.radius": ["none", "sharp", "subtle", "soft", "round", "pill"],
  "shape.corners": ["round", "squircle"],
  density: ["compact", "comfortable", "spacious"],
  depth: ["flat", "subtle", "soft", "dramatic"],
  surface: ["solid", "layered", "glass"],
  motion: ["minimal", "smooth", "playful"],
};

/** Knobs with a natural order, so "rounder" or "more compact" can be one step: set <knob> +1 / -1. */
export const ORDERED = {
  "shape.radius": ["none", "sharp", "subtle", "soft", "round", "pill"],
  density: ["compact", "comfortable", "spacious"],
  depth: ["flat", "subtle", "soft", "dramatic"],
  motion: ["minimal", "smooth", "playful"],
  "type.scale": ["compact", "balanced", "expressive", "dramatic"],
  "color.tint": ["none", "subtle", "noticeable"],
};

export const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
export function setPath(obj, path, value) {
  const keys = path.split(".");
  let o = obj;
  for (const k of keys.slice(0, -1)) o = o[k] ??= {};
  o[keys.at(-1)] = value;
  return obj;
}
const merge = (a, b) => {
  const out = structuredClone(a);
  for (const [k, v] of Object.entries(b ?? {})) {
    if (k.startsWith("$")) continue;
    out[k] = v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" ? merge(out[k], v) : v;
  }
  return out;
};

export function listPresets() {
  const names = ["neutral", "classic", "editorial", "friendly", "technical", "glass"];
  return names
    .filter((n) => existsSync(join(PRESETS_DIR, `${n}.json`)))
    .map((n) => {
      const p = JSON.parse(readFileSync(join(PRESETS_DIR, `${n}.json`), "utf8"));
      return { name: n, description: p.$description ?? "" };
    });
}

/** Resolve preset + overrides into a full knob set, validating values. */
export function resolveKnobs(input) {
  const presetName = input.preset ?? "neutral";
  const presetPath = join(PRESETS_DIR, `${presetName}.json`);
  if (!existsSync(presetPath)) throw new Error(`Unknown preset "${presetName}". Available: ${listPresets().map((p) => p.name).join(", ")}`);
  const base = presetName === "neutral" ? {} : JSON.parse(readFileSync(join(PRESETS_DIR, "neutral.json"), "utf8"));
  const preset = JSON.parse(readFileSync(presetPath, "utf8"));
  const knobs = merge(merge(base, preset), input);
  knobs.preset = presetName;
  const errors = [];
  for (const [path, allowed] of Object.entries(ALLOWED)) {
    const v = get(knobs, path);
    if (v === undefined || v === null) continue;
    const numericOk = (path === "color.neutral" && typeof v === "number") || (path === "type.scale" && typeof v === "number");
    if (!numericOk && !allowed.includes(v)) errors.push(`${path}: "${v}" is not one of ${allowed.join(" | ")}`);
  }
  if (errors.length) throw new Error("Invalid theme settings:\n  " + errors.join("\n  "));
  return knobs;
}

// ---------------------------------------------------------------------------
// Knob → token mappings
// ---------------------------------------------------------------------------

const rem = (px) => `${+(px / 16).toFixed(4)}rem`;

const RADIUS = {
  //        control check card dialog (px)
  none:   [0, 0, 0, 0],
  sharp:  [2, 2, 4, 6],
  subtle: [6, 4, 10, 16],
  soft:   [10, 5, 14, 20],
  round:  [14, 6, 20, 28],
  pill:   [9999, 6, 24, 32],
};
const DENSITY = {
  //             sm  md  lg  card
  compact:     [32, 36, 44, 16],
  comfortable: [36, 44, 48, 24],
  spacious:    [40, 48, 56, 32],
};
const SCALE = { compact: 1.125, balanced: 1.2, expressive: 1.25, dramatic: 1.333 };
const MOTION = {
  minimal: { d: ["60ms", "100ms", "160ms", "220ms"], out: [0.2, 0, 0, 1], in: [0.4, 0, 1, 1], inout: [0.4, 0, 0.2, 1] },
  smooth: { d: ["80ms", "140ms", "220ms", "340ms"], out: [0.2, 0, 0, 1], in: [0.4, 0, 1, 1], inout: [0.4, 0, 0.2, 1] },
  playful: { d: ["100ms", "180ms", "280ms", "420ms"], out: [0.34, 1.4, 0.64, 1], in: [0.4, 0, 1, 1], inout: [0.65, 0, 0.35, 1] },
};
const SHADOW = (ink) => {
  const s = (a) => `oklch(${ink} / ${a})`;
  return {
    flat: { sm: "none", md: "none", lg: "none", dark: { sm: "none", md: "none", lg: "none" } },
    subtle: {
      sm: `0 1px 1px ${s(0.05)}`,
      md: `0 2px 6px -1px ${s(0.08)}, 0 1px 2px ${s(0.04)}`,
      lg: `0 8px 24px -6px ${s(0.14)}, 0 2px 6px -2px ${s(0.06)}`,
      dark: { sm: "0 1px 1px oklch(0 0 0 / 0.4)", md: "0 2px 6px -1px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(1 0 0 / 0.05)", lg: "0 8px 24px -6px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(1 0 0 / 0.07)" },
    },
    soft: {
      sm: `0 1px 2px ${s(0.06)}, 0 1px 1px ${s(0.04)}`,
      md: `0 4px 12px -2px ${s(0.1)}, 0 2px 4px -2px ${s(0.06)}`,
      lg: `0 16px 40px -8px ${s(0.18)}, 0 4px 10px -4px ${s(0.08)}`,
      dark: { sm: "0 1px 2px oklch(0 0 0 / 0.5)", md: "0 4px 12px -2px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(1 0 0 / 0.06)", lg: "0 16px 40px -8px oklch(0 0 0 / 0.7), 0 0 0 1px oklch(1 0 0 / 0.08)" },
    },
    dramatic: {
      sm: `0 2px 4px ${s(0.08)}, 0 1px 2px ${s(0.06)}`,
      md: `0 10px 24px -6px ${s(0.18)}, 0 4px 8px -4px ${s(0.1)}`,
      lg: `0 32px 64px -16px ${s(0.3)}, 0 12px 24px -8px ${s(0.14)}`,
      dark: { sm: "0 2px 4px oklch(0 0 0 / 0.6)", md: "0 10px 24px -6px oklch(0 0 0 / 0.7), 0 0 0 1px oklch(1 0 0 / 0.07)", lg: "0 32px 64px -16px oklch(0 0 0 / 0.8), 0 0 0 1px oklch(1 0 0 / 0.09)" },
    },
  };
};

const SANS_FALLBACK = ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"];
const SERIF_FALLBACK = ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"];
const MONO_FALLBACK = ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"];

function setColor(tokens, name, light, dark) {
  const t = (tokens.color[name] ??= {});
  if (light) t.$value = typeof light === "string" ? light : formatOklch(fitGamut(light));
  if (dark) {
    t.$extensions ??= { "everyday-ui": {} };
    t.$extensions["everyday-ui"].dark = typeof dark === "string" ? dark : formatOklch(fitGamut(dark));
  }
}
const lightOf = (tokens, name) => parseOklch(tokens.color[name].$value);
const darkOf = (tokens, name) => parseOklch(tokens.color[name].$extensions["everyday-ui"].dark);

function deriveAccent(tokens, brand) {
  // Light mode: start at the brand's own lightness (capped), contrast fix moves it if needed.
  const l = fitGamut({ L: Math.min(brand.L, 0.6), C: brand.C, H: brand.H });
  const d = fitGamut({ L: Math.max(brand.L, 0.74), C: brand.C * 0.8, H: brand.H });
  setColor(tokens, "accent", l, d);
  syncAccentFamily(tokens);
}

function syncAccentFamily(tokens) {
  const l = lightOf(tokens, "accent");
  const d = darkOf(tokens, "accent");
  setColor(tokens, "accent-hover", { L: l.L - 0.06, C: l.C, H: l.H }, { L: Math.min(d.L + 0.05, 0.96), C: d.C * 0.6, H: d.H });
  setColor(tokens, "focus", formatOklch(l), formatOklch(d));
}

function deriveNeutrals(tokens, defaults, hue, factor) {
  for (const name of ["paper", "surface", "sunken", "ink", "ink-muted", "border", "border-strong"]) {
    const l = parseOklch(defaults.color[name].$value);
    const d = parseOklch(defaults.color[name].$extensions["everyday-ui"].dark);
    const tint = (c, min) => Math.max(c.C, min) * factor;
    setColor(tokens, name, { L: l.L, C: tint(l, 0.002), H: hue }, { L: d.L, C: tint(d, 0.004), H: hue });
  }
}

function deriveOverlay(tokens, surface) {
  const sl = lightOf(tokens, "surface");
  const sd = darkOf(tokens, "surface");
  if (surface === "glass") {
    setColor(tokens, "overlay", formatOklch({ ...sl, alpha: 0.62 }), formatOklch({ L: sd.L + 0.03, C: sd.C, H: sd.H, alpha: 0.62 }));
    tokens.effect["overlay-blur"].$value = "24px";
  } else {
    // Floating layers are a touch lighter than surface in dark mode (lighter = closer).
    setColor(tokens, "overlay", formatOklch(sl), formatOklch({ L: sd.L + 0.03, C: sd.C, H: sd.H }));
    tokens.effect["overlay-blur"].$value = "0px";
  }
}

// ---------------------------------------------------------------------------
// Contrast auto-fix
// ---------------------------------------------------------------------------

const MOVABLE_FG = new Set(["ink", "ink-muted", "accent", "border-strong", "danger", "success", "warning"]);
const ON_FILL = { "accent-ink": true, "danger-ink": true };

function nudge(tokens, name, mode, awayFrom, step = 0.01) {
  const c = mode === "light" ? lightOf(tokens, name) : darkOf(tokens, name);
  const dir = c.L >= awayFrom.L ? 1 : -1;
  const L = Math.min(0.99, Math.max(0.05, c.L + dir * step));
  if (L === c.L) return false;
  const next = fitGamut({ ...c, L });
  setColor(tokens, name, mode === "light" ? next : null, mode === "dark" ? next : null);
  return true;
}

export function autoFixContrast(tokens, notes) {
  const before = JSON.stringify(tokens.color);
  const touched = new Set();
  for (let pass = 0; pass < 80; pass++) {
    const { failed } = checkContrast(tokens);
    if (failed.length === 0) break;
    for (const f of failed) {
      const get = (n) => (f.mode === "light" ? lightOf(tokens, n) : darkOf(tokens, n));
      if (f.bg === "overlay" && get("overlay").alpha < 1) {
        const o = get("overlay");
        const next = formatOklch({ ...o, alpha: Math.min(1, o.alpha + 0.02) });
        setColor(tokens, "overlay", f.mode === "light" ? next : null, f.mode === "dark" ? next : null);
        touched.add(`overlay opacity (${f.mode})`);
      } else if (MOVABLE_FG.has(f.fg)) {
        if (nudge(tokens, f.fg, f.mode, get(f.bg))) touched.add(`${f.fg} (${f.mode})`);
      } else if (ON_FILL[f.fg]) {
        // Text on a fill: move the fill away from the text color.
        if (nudge(tokens, f.bg, f.mode, get(f.fg))) touched.add(`${f.bg} (${f.mode})`);
      }
    }
    syncAccentFamily(tokens);
  }
  if (JSON.stringify(tokens.color) !== before && touched.size)
    notes.push(`Contrast auto-fix adjusted: ${[...touched].join(", ")}.`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function themeFromKnobs(input, defaults = JSON.parse(readFileSync(DEFAULTS_PATH, "utf8"))) {
  const k = resolveKnobs(input);
  const t = structuredClone(defaults);
  const notes = [];
  t.$description = `Everyday UI theme "${k.name ?? k.preset}" (generated from everyday.theme.json; preset ${k.preset}).`;
  t.$extensions = { "everyday-ui": { defaultMode: k.color?.mode ?? "system", contrast: k.color?.contrast ?? "standard", theme: k.name ?? k.preset } };

  // Color
  const brand = parseColor(k.color?.accent ?? "oklch(0.5 0.165 262)");
  const hueSetting = k.color?.neutral ?? "warm";
  const hue = typeof hueSetting === "number" ? hueSetting : { warm: 75, cool: 250, neutral: 0, brand: brand.H }[hueSetting];
  const factor = hueSetting === "neutral" ? 0 : { none: 0, subtle: 1, noticeable: 2.4 }[k.color?.tint ?? "subtle"];
  deriveNeutrals(t, defaults, hue, factor);
  setColor(t, "brand", formatOklch(fitGamut(brand)), formatOklch(fitGamut(brand)));
  deriveAccent(t, brand);
  const al = lightOf(t, "accent");
  setColor(t, "accent-ink", { L: 0.985, C: 0.004, H: al.H }, { L: 0.16, C: 0.03, H: al.H });
  setColor(t, "accent-subtle", { L: 0.95, C: Math.min(0.03, al.C * 0.25), H: al.H }, { L: 0.28, C: Math.min(0.06, al.C * 0.4), H: al.H });
  if (brand.L > 0.75) notes.push(`The brand color is very light; buttons and links use a darker shade for contrast. The original stays available as "brand" for decoration.`);
  const brandIsStatus =
    brand.C > 0.08 && brand.H >= 10 && brand.H <= 40 ? "red" : brand.C > 0.08 && brand.H >= 125 && brand.H <= 165 ? "green" : null;
  if (brandIsStatus) notes.push(`The brand color reads as ${brandIsStatus}, which users associate with ${brandIsStatus === "green" ? "success" : "errors and destructive actions"}. Consider a dark neutral or blue for actions and keep the brand color decorative.`);

  // Surface
  const surface = k.surface ?? "layered";
  if (surface === "solid") {
    const s = lightOf(t, "surface");
    setColor(t, "paper", formatOklch(s), null);
  }
  deriveOverlay(t, surface);

  // Type
  const sans = k.type?.sans ?? "Hanken Grotesk";
  const display = k.type?.display ?? null;
  t.font.family.sans.$value = [sans, ...SANS_FALLBACK];
  t.font.family.display.$value = display ? [display, ...(k.type?.displayStyle === "serif" ? SERIF_FALLBACK : SANS_FALLBACK)] : [sans, ...SANS_FALLBACK];
  t.font.family.mono.$value = [k.type?.mono ?? "JetBrains Mono", ...MONO_FALLBACK];
  t.font.weight.heading.$value = k.type?.headingWeight ?? 600;
  const ratio = typeof k.type?.scale === "number" ? k.type.scale : SCALE[k.type?.scale ?? "balanced"];
  const tight = (k.type?.headingTracking ?? "tight") === "tight";
  const steps = ["xl", "2xl", "3xl", "4xl", "5xl"];
  const lines = [1.35, 1.25, 1.15, 1.08, 1.02];
  const tracking = tight ? ["-0.01em", "-0.015em", "-0.02em", "-0.025em", "-0.03em"] : ["0", "-0.005em", "-0.01em", "-0.012em", "-0.015em"];
  steps.forEach((s, i) => {
    t.text[s].size.$value = rem(Math.round(18 * ratio ** (i + 1)));
    t.text[s].line.$value = lines[i];
    t.text[s].tracking.$value = tracking[i];
  });

  // Shape
  const [rc, rk, rcard, rd] = RADIUS[k.shape?.radius ?? "subtle"];
  Object.assign(t.radius, {
    control: { ...t.radius.control, $value: rc >= 9999 ? "9999px" : rem(rc) },
    check: { ...t.radius.check, $value: rem(rk) },
    card: { ...t.radius.card, $value: rem(rcard) },
    dialog: { ...t.radius.dialog, $value: rem(rd) },
    sm: { $value: rem(Math.min(rk, 6)) },
    md: { $value: rc >= 9999 ? rem(16) : rem(rc) },
    lg: { $value: rem(rcard) },
    xl: { $value: rem(rd) },
  });
  t.shape.corner.$value = k.shape?.corners ?? "round";
  if (t.shape.corner.$value === "squircle")
    notes.push("Squircle corners use CSS corner-shape (Chromium-based browsers today); others show regular rounded corners.");

  // Density
  const [sm, md, lg, card] = DENSITY[k.density ?? "comfortable"];
  t.size["control-sm"].$value = rem(sm);
  t.size["control-md"].$value = rem(md);
  t.size["control-lg"].$value = rem(lg);
  t.space.card.$value = rem(card);
  if (k.density === "compact") notes.push("Compact density makes default controls 36 px: fine for mouse-driven desktop tools; use size lg for anything touch.");

  // Depth
  const ink = lightOf(t, "ink");
  const sh = SHADOW(`${ink.L.toFixed(2)} ${ink.C.toFixed(3)} ${ink.H.toFixed(0)}`)[k.depth ?? "soft"];
  for (const s of ["sm", "md", "lg"]) {
    t.shadow[s].$value = sh[s];
    t.shadow[s].$extensions = { "everyday-ui": { dark: sh.dark[s] } };
  }

  // Motion
  const m = MOTION[k.motion ?? "smooth"];
  ["instant", "fast", "base", "slow"].forEach((n, i) => (t.motion.duration[n].$value = m.d[i]));
  t.motion.ease.out.$value = m.out;
  t.motion.ease.in.$value = m.in;
  t.motion.ease["in-out"].$value = m.inout;

  autoFixContrast(t, notes);
  if (surface === "glass") {
    const ol = lightOf(t, "overlay").alpha, od = darkOf(t, "overlay").alpha;
    notes.push(`Glass surfaces: opacity ${Math.round(ol * 100)} % (light) / ${Math.round(od * 100)} % (dark), the minimum that keeps text readable over any backdrop. Solid for people who prefer reduced transparency.`);
  }

  const fonts = [...new Set([sans, display, k.type?.mono ?? "JetBrains Mono"].filter(Boolean))];
  return { tokens: t, knobs: k, notes, fonts };
}
