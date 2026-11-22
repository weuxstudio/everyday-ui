// Color math for Everyday UI. Zero dependencies.
// OKLCH in, OKLCH out; WCAG 2 and APCA contrast; alpha compositing; hex parsing.

/** Parses "oklch(L C H)" or "oklch(L C H / a)" into { L, C, H, alpha }. */
export function parseOklch(str) {
  const m = String(str).match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/);
  if (!m) throw new Error(`Cannot parse color "${str}" (expected oklch(L C H) or a hex value)`);
  return { L: +m[1], C: +m[2], H: +m[3], alpha: m[4] === undefined ? 1 : +m[4] };
}

export function formatOklch({ L, C, H, alpha = 1 }) {
  const r = (n, d) => (+n).toFixed(d).replace(/\.?0+$/, (s) => (s.startsWith(".") ? "" : s)) || "0";
  const base = `${L.toFixed(3)} ${Math.max(0, C).toFixed(3)} ${r(((H % 360) + 360) % 360, 1)}`;
  return alpha < 1 ? `oklch(${base} / ${alpha.toFixed(2)})` : `oklch(${base})`;
}

function oklabToLinear(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** Linear sRGB (unclipped) for an oklch color. */
export function toLinear(color) {
  const { L, C, H } = typeof color === "string" ? parseOklch(color) : color;
  const h = (H * Math.PI) / 180;
  return oklabToLinear(L, C * Math.cos(h), C * Math.sin(h));
}

export const inGamut = (color) => toLinear(color).every((x) => x > -0.002 && x < 1.002);

/** Reduce chroma until the color fits sRGB. */
export function fitGamut(c) {
  // Aim slightly inside the gamut so rounding to 3 decimals can't push it back out.
  const strict = (x) => toLinear(x).every((v) => v > -0.0005 && v < 1.0005);
  const out = { ...c };
  while (!strict(out) && out.C > 0) out.C = Math.max(0, out.C - 0.001);
  return out;
}

const encode = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const decode = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const clip = (rgb) => rgb.map((c) => Math.min(1, Math.max(0, c)));

/** "#2f5bd3" | "#25d" | "oklch(...)" → { L, C, H, alpha } */
export function parseColor(input) {
  const s = String(input).trim();
  if (s.startsWith("oklch")) return parseOklch(s);
  const hex = s.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((x) => x + x).join("") : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`Cannot parse color "${input}" (use #rrggbb or oklch(L C H))`);
  const [r, g, b] = [0, 2, 4].map((i) => decode(parseInt(full.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const q = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * q;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * q;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * q;
  const C = Math.sqrt(A * A + B * B);
  const H = C < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { L, C, H, alpha: 1 };
}

export function toHex(color) {
  const [r, g, b] = clip(toLinear(color)).map(encode);
  return "#" + [r, g, b].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
}

/** Composite a (possibly translucent) color over an opaque backdrop, in gamma-encoded sRGB like browsers do. */
export function composite(top, backdrop) {
  const t = typeof top === "string" ? parseOklch(top) : top;
  if (t.alpha >= 1) return t;
  const fg = clip(toLinear(t)).map(encode);
  const bg = clip(toLinear(backdrop)).map(encode);
  const mixed = fg.map((c, i) => c * t.alpha + bg[i] * (1 - t.alpha)).map(decode);
  // back to oklch via hex round-trip (precision is ample for contrast checks)
  return parseColor("#" + mixed.map((x) => Math.round(encode(x) * 255).toString(16).padStart(2, "0")).join(""));
}

const relLuminance = (color) => {
  const [r, g, b] = clip(toLinear(color));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG 2.x contrast ratio (1–21). */
export function wcag(fg, bg) {
  const a = relLuminance(fg), b = relLuminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// APCA-W3 0.0.98G
const apcaY = (color) => {
  const [r, g, b] = clip(toLinear(color)).map(encode);
  let y = 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.072175 * b ** 2.4;
  if (y < 0.022) y += (0.022 - y) ** 1.414;
  return y;
};

/** APCA lightness contrast |Lc| (0–~106) for text on background. */
export function apca(txt, bg) {
  const t = apcaY(txt), b = apcaY(bg);
  if (Math.abs(b - t) < 0.0005) return 0;
  let out;
  if (b > t) { const s = (b ** 0.56 - t ** 0.57) * 1.14; out = s < 0.1 ? 0 : s - 0.027; }
  else { const s = (b ** 0.65 - t ** 0.62) * 1.14; out = s > -0.1 ? 0 : s + 0.027; }
  return Math.abs(out * 100);
}
