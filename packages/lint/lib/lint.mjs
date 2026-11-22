// everyday-lint core: mechanical checks for Everyday UI rules. No dependencies.
// Every finding: { file, line, col, severity: "error" | "warning", rule, message, fix }.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const RULES = {
  "font-weight": "Only the theme's font weights (regular, semibold, heading).",
  "spacing": "Spacing (margin, padding, gap) only from the scale or spacing tokens.",
  "raw-color": "No raw colour values outside token files; no default Tailwind palette.",
  "native-dialog": "No confirm(), alert() or prompt(): use a designed dialog or inline message.",
  "disabled-submit": "Submit buttons aren't disabled; validate on submit and explain errors.",
  "icon-button-name": "Icon-only buttons need an accessible name (aria-label or visually hidden text).",
};

const DEFAULTS = {
  fontWeights: [400, 600],
  // px values on the 8-pt scale (plus 0); Tailwind steps that map to them.
  spacingPx: [0, 4, 8, 16, 24, 32, 48, 80],
  tailwindSteps: ["0", "px", "1", "2", "4", "6", "8", "12", "20"],
  namedSpacing: ["card", "touch", "control-sm", "control-md", "control-lg", "measure", "auto", "full", "screen", "dvh", "svh", "lvh", "fit", "min", "max"],
  tokenPrefixes: ["--eu-space-", "--eu-size-", "--spacing"],
  // Inside components, half steps (gap-1.5, py-2.5, px-3) are allowed for optical alignment.
  componentPaths: ["/components/", "/ui/", "/lib/components/"],
  tokenFiles: ["tokens.css", "theme.css", "tailwind.css", ".tokens.", "/tokens/", "/themes/"],
  ignoreDirs: ["node_modules", "dist", "build", ".git", ".svelte-kit", ".next", ".nuxt", "coverage", ".turbo", ".vercel", "out"],
  extensions: [".css", ".scss", ".tsx", ".jsx", ".svelte", ".vue", ".html", ".ts", ".js", ".mjs"],
  rules: {},
};

const MARKUP = new Set([".tsx", ".jsx", ".svelte", ".vue", ".html"]);
const STYLE = new Set([".css", ".scss"]);
const SCRIPT = new Set([".ts", ".js", ".mjs"]);

const TW_WEIGHTS = { thin: 100, extralight: 200, light: 300, normal: 400, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 };
const CSS_WEIGHT_WORDS = { normal: 400, bold: 700 };
const TW_PALETTE = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const TW_COLOR_UTIL = "bg|text|border|border-[trblxy]|ring|ring-offset|fill|stroke|outline|from|to|via|decoration|accent|caret|shadow|divide|placeholder";
const SPACING_PROPS = /^(margin|padding)(-(top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))?$|^(gap|row-gap|column-gap)$/;

// ---------- config ----------

export function loadConfig(cwd = process.cwd(), configPath) {
  const cfg = structuredClone(DEFAULTS);
  const file = configPath ? resolve(cwd, configPath) : join(cwd, "everyday.lint.json");
  if (existsSync(file)) {
    const user = JSON.parse(readFileSync(file, "utf8"));
    for (const [k, v] of Object.entries(user)) {
      if (k.startsWith("$")) continue;
      // Arrays named "extra…" extend the defaults; others replace.
      const m = k.match(/^extra([A-Z]\w*)$/);
      if (m) {
        const key = m[1][0].toLowerCase() + m[1].slice(1);
        cfg[key] = [...(cfg[key] ?? []), ...v];
      } else cfg[k] = v;
    }
  }
  const heading = headingWeightFromTheme(cwd);
  if (heading && !cfg.fontWeights.includes(heading)) cfg.fontWeights = [...cfg.fontWeights, heading];
  return cfg;
}

function headingWeightFromTheme(cwd) {
  const file = join(cwd, "everyday.theme.json");
  if (!existsSync(file)) return null;
  try {
    const theme = JSON.parse(readFileSync(file, "utf8"));
    if (theme.type?.headingWeight) return Number(theme.type.headingWeight);
    if (theme.preset) {
      const here = dirname(fileURLToPath(import.meta.url));
      for (const dir of [
        join(cwd, "node_modules/@everyday-ui/tokens/presets"),
        join(here, "../../tokens/presets"),
        join(here, "../../../theme-generator/presets"), // inside the skill: tools/lint/lib
      ]) {
        const p = join(dir, `${theme.preset}.json`);
        if (existsSync(p)) return Number(JSON.parse(readFileSync(p, "utf8")).type?.headingWeight ?? 600);
      }
    }
  } catch {
    /* unreadable theme: fall back to defaults */
  }
  return null;
}

// ---------- files ----------

export function collectFiles(paths, cfg) {
  const out = [];
  const walk = (p) => {
    const st = statSync(p);
    if (st.isDirectory()) {
      for (const name of readdirSync(p)) {
        if (cfg.ignoreDirs.includes(name)) continue;
        walk(join(p, name));
      }
    } else if (cfg.extensions.includes(extname(p))) out.push(p);
  };
  for (const p of paths) {
    if (!existsSync(p)) throw new Error(`everyday-lint: path not found: ${p}`);
    walk(resolve(p));
  }
  return out.sort();
}

// ---------- helpers ----------

/** Blank out comments but keep offsets/lines, so positions stay right. */
function stripComments(src, ext) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  let s = src.replace(/\/\*[\s\S]*?\*\//g, blank);
  if (MARKUP.has(ext)) s = s.replace(/<!--[\s\S]*?-->/g, blank);
  if (!STYLE.has(ext)) {
    // line comments: not inside strings or URLs (crude but safe: require start of line or whitespace before //)
    s = s.replace(/(^|[\s;{}()])\/\/[^\n]*/gm, (m, pre) => pre + blank(m.slice(pre.length)));
  }
  return s;
}

function lineCol(src, index) {
  let line = 1, last = -1;
  for (let i = 0; i < index; i++) if (src.charCodeAt(i) === 10) { line++; last = i; }
  return { line, col: index - last };
}

function ignoresFor(src) {
  const lines = src.split("\n");
  const file = new Set();
  const byLine = new Map(); // line number -> Set(rules) ("*" = all)
  const parse = (txt) => {
    const list = txt.split("--")[0].trim();
    return list ? list.split(/[\s,]+/).filter(Boolean) : ["*"];
  };
  lines.forEach((l, i) => {
    let m = l.match(/everyday-lint-ignore-file\b([^*\n>]*)/);
    if (m) parse(m[1]).forEach((r) => file.add(r));
    m = l.match(/everyday-lint-ignore-next-line\b([^*\n>]*)/);
    if (m) byLine.set(i + 2, new Set(parse(m[1])));
    else if ((m = l.match(/everyday-lint-ignore\b(?!-)([^*\n>]*)/))) byLine.set(i + 1, new Set(parse(m[1])));
  });
  return (rule, line) => file.has("*") || file.has(rule) || byLine.get(line)?.has("*") || byLine.get(line)?.has(rule);
}

function toPx(num, unit) {
  const n = Math.abs(parseFloat(num));
  if (unit === "px") return n;
  if (unit === "rem") return n * 16;
  return null; // em, %, vw… are relative: not checked
}

/** Check one CSS value for spacing: raw lengths on the scale, var() tokens known. */
function checkSpacingValue(value, cfg) {
  const problems = [];
  for (const m of value.matchAll(/var\(\s*(--[\w-]+)/g)) {
    const name = m[1];
    if (!cfg.tokenPrefixes.some((p) => name.startsWith(p))) problems.push({ kind: "token", text: name });
  }
  // remove var(...) and env(...) before looking at raw numbers
  const raw = value.replace(/(var|env)\([^()]*(\([^()]*\)[^()]*)*\)/g, " ");
  for (const m of raw.matchAll(/(-?\d*\.?\d+)(px|rem)\b/g)) {
    const px = toPx(m[1], m[2]);
    if (px !== null && !cfg.spacingPx.includes(px)) problems.push({ kind: "raw", text: m[0], px });
  }
  return problems;
}

function nearestStep(px, cfg) {
  return cfg.spacingPx.reduce((a, b) => (Math.abs(b - px) < Math.abs(a - px) ? b : a));
}

function isTokenFile(file, cfg) {
  const f = file.split(sep).join("/");
  return cfg.tokenFiles.some((t) => f.includes(t));
}
function isComponentFile(file, cfg) {
  const f = file.split(sep).join("/");
  return cfg.componentPaths.some((t) => f.includes(t));
}

// ---------- rules ----------

function cssDeclarations(src) {
  // property: value; pairs, in CSS files and in style blocks / style attributes of markup.
  const out = [];
  const re = /(^|[{;\s"'`])(-?[a-z][a-z-]*)\s*:\s*([^;{}"'`\n]+)/g;
  for (const m of src.matchAll(re)) out.push({ prop: m[2], value: m[3].trim(), index: m.index + m[1].length });
  return out;
}

function styleRegions(src, ext) {
  if (STYLE.has(ext)) return [{ start: 0, text: src }];
  const regions = [];
  for (const m of src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) regions.push({ start: m.index + m[0].indexOf(m[1]), text: m[1] });
  for (const m of src.matchAll(/\sstyle\s*=\s*"([^"]*)"/g)) regions.push({ start: m.index + m[0].indexOf(m[1]), text: m[1] });
  // React style objects: style={{ fontWeight: 700, padding: "13px" }}
  for (const m of src.matchAll(/style=\{\{([\s\S]*?)\}\}/g)) {
    const css = m[1].replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`).replace(/,(?=\s*[a-z-]+\s*:)/g, ";").replace(/["']/g, "");
    regions.push({ start: m.index + m[0].indexOf(m[1]), text: css, approximate: true });
  }
  return regions;
}

function classTokens(src) {
  // class / className strings and template literals, plus cx()/clsx() string arguments.
  const out = [];
  const re = /(?:class(?:Name)?\s*=\s*\{?\s*|cx\(|clsx\(|cn\(|\s)(["'`])([^"'`]*?)\1/g;
  for (const m of src.matchAll(re)) {
    const start = m.index + m[0].lastIndexOf(m[2]);
    let offset = 0;
    for (const tok of m[2].split(/(\s+)/)) {
      if (tok && !/^\s+$/.test(tok)) out.push({ text: tok, index: start + offset });
      offset += tok.length;
    }
  }
  return out;
}

function checkFile(file, src, cfg) {
  const ext = extname(file);
  const clean = stripComments(src, ext);
  const findings = [];
  const ignored = ignoresFor(src);
  const tokenFile = isTokenFile(file, cfg);
  const componentFile = isComponentFile(file, cfg);
  const add = (rule, severity, index, message, fix) => {
    if (cfg.rules[rule] === "off") return;
    const { line, col } = lineCol(src, index);
    if (ignored(rule, line)) return;
    findings.push({ file, line, col, severity: cfg.rules[rule] ?? severity, rule, message, fix });
  };
  const weights = cfg.fontWeights;

  // --- CSS declarations (style files, <style>, style attributes) ---
  if (!SCRIPT.has(ext)) {
    for (const region of styleRegions(clean, ext)) {
      for (const d of cssDeclarations(region.text)) {
        const at = region.start + d.index;
        if (d.prop === "font-weight") {
          const v = d.value.replace(/!important/, "").trim();
          const n = /^\d+$/.test(v) ? Number(v) : CSS_WEIGHT_WORDS[v];
          if (n !== undefined && !weights.includes(n))
            add("font-weight", "error", at, `font-weight ${v} is not one of the theme's weights (${weights.join(", ")}).`, "Use var(--eu-font-weight-regular | -semibold | -heading).");
        }
        if (SPACING_PROPS.test(d.prop) && !tokenFile) {
          for (const p of checkSpacingValue(d.value, cfg)) {
            if (p.kind === "token")
              add("spacing", "warning", at, `${d.prop} uses ${p.text}, which isn't a spacing token.`, `Use --eu-space-* (or add the prefix to tokenPrefixes in everyday.lint.json).`);
            else
              add("spacing", "error", at, `${d.prop}: ${p.text} is off the spacing scale.`, `Use the nearest step ${nearestStep(p.px, cfg)}px as a token (var(--eu-space-…)).`);
          }
        }
        if (!tokenFile && !/^--/.test(d.prop)) {
          const colorRe = /#[0-9a-fA-F]{3,8}\b|\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(/g;
          for (const c of d.value.matchAll(colorRe)) {
            if (c[0].startsWith("#") && ![4, 5, 7, 9].includes(c[0].length)) continue;
            add("raw-color", "error", at, `Raw colour ${c[0]}${c[0].endsWith("(") ? "…)" : ""} in ${d.prop}.`, "Use a colour token (var(--eu-color-…)); new colours belong in the theme.");
          }
        }
      }
    }
  }

  // --- Tailwind classes ---
  if (MARKUP.has(ext) || SCRIPT.has(ext)) {
    for (const t of classTokens(clean)) {
      const cls = t.text.replace(/^([a-z0-9-]+:|\[[^\]]*\]:)*/, "").replace(/^!/, ""); // strip variants and !important
      let m = cls.match(/^font-(thin|extralight|light|normal|regular|medium|semibold|bold|extrabold|black)$/);
      if (m && !weights.includes(TW_WEIGHTS[m[1]]))
        add("font-weight", "error", t.index, `${t.text}: weight ${TW_WEIGHTS[m[1]]} is not one of the theme's weights (${weights.join(", ")}).`, "Use font-regular, font-semibold or font-heading.");
      m = cls.match(/^-?(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y)-(.+)$/);
      if (m && !tokenFile) {
        const v = m[2];
        if (v.startsWith("[")) {
          for (const p of checkSpacingValue(v.slice(1, -1).replace(/_/g, " "), cfg))
            add("spacing", p.kind === "raw" ? "error" : "warning", t.index, `${t.text}: ${p.text} ${p.kind === "raw" ? "is off the spacing scale" : "isn't a spacing token"}.`, p.kind === "raw" ? `Use the nearest step (${nearestStep(p.px, cfg)}px).` : "Use a scale class (p-4, gap-6…).");
        } else if (v.startsWith("(")) {
          const name = v.slice(1, -1);
          if (!cfg.tokenPrefixes.some((p) => name.startsWith(p)))
            add("spacing", "warning", t.index, `${t.text}: ${name} isn't a spacing token.`, "Use --eu-space-* or a scale class.");
        } else if (!cfg.tailwindSteps.includes(v) && !cfg.namedSpacing.includes(v)) {
          if (/^\d+(\.\d+)?$/.test(v) && componentFile && Number(v) <= 4) {
            // half steps inside components: allowed for optical alignment
          } else if (/^\d+(\.\d+)?$/.test(v)) {
            add("spacing", "warning", t.index, `${t.text} (${Number(v) * 4}px) is off the 8-pt scale.`, "Use 1, 2, 4, 6, 8, 12 or 20 (4–80px). Half steps only inside components.");
          }
        }
      }
      m = cls.match(new RegExp(`^(${TW_COLOR_UTIL})-((${TW_PALETTE})-\\d{2,3}|white|black)(/\\d+)?$`));
      if (m && !tokenFile)
        add("raw-color", "error", t.index, `${t.text} uses Tailwind's default palette, not the theme.`, "Use token colours (bg-surface, text-ink, border-border, bg-accent…).");
      m = cls.match(/^[a-z-]+-\[(#[0-9a-fA-F]{3,8}|(rgba?|hsla?|oklch|oklab|lab|lch|color)\([^\]]*\))\]$/);
      if (m && !tokenFile) add("raw-color", "error", t.index, `${t.text}: raw colour in an arbitrary value.`, "Use a colour token.");
    }
    // Hex colours in strings or JS style objects (not href="#…" anchors)
    if (!tokenFile) {
      for (const m of clean.matchAll(/(?<=["'`(\s:,])#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![\w-])/g)) {
        const before = clean.slice(Math.max(0, m.index - 14), m.index);
        if (/(href|to|id|for|xlink:href|url|path)\s*=\s*\{?["'`]?$/.test(before)) continue;
        if (/content=["']$/.test(before)) continue; // <meta name="theme-color" content="#…"> can't use CSS variables
        if (STYLE.has(ext)) continue; // CSS handled above
        // skip if this sits inside a class token already reported
        const lc = lineCol(src, m.index);
        if (findings.some((f) => f.rule === "raw-color" && f.line === lc.line)) continue;
        add("raw-color", "error", m.index, `Raw colour ${m[0]} in code.`, "Use a colour token; new colours belong in the theme.");
      }
    }
  }

  // --- confirm() / alert() / prompt() ---
  if (!STYLE.has(ext)) {
    // A file that defines its own confirm/alert/prompt (const confirm = …) calls that, not the browser's.
    const shadowed = new Set([...clean.matchAll(/\b(?:function|const|let|var)\s+(confirm|alert|prompt)\b/g)].map((m) => m[1]));
    for (const m of clean.matchAll(/(^|[^\w.$]|window\.)(confirm|alert|prompt)\s*\(/g)) {
      if (shadowed.has(m[2]) && m[1] !== "window.") continue;
      const before = clean.slice(Math.max(0, m.index - 12), m.index + m[1].length);
      if (/function\s*$|def\s*$|\bconst\s*$|\blet\s*$/.test(before)) continue;
      add("native-dialog", "error", m.index + m[1].length, `${m[2]}() blocks the page, can't be styled and is easy to dismiss by accident.`, m[2] === "confirm" ? "Use a Dialog that names the object, consequence and both outcomes, or offer undo." : "Show the message inline or in a Dialog.");
    }
  }

  // --- buttons: disabled submits, icon-only names ---
  if (MARKUP.has(ext)) {
    for (const tag of scanTags(clean, /<(button|Button)\b/g)) {
      const a = tag.attrs;
      const isSubmit = /\btype\s*=\s*["'{]?\s*["']?submit/.test(a) || (tag.name === "button" && !/\btype\s*=/.test(a) && insideForm(clean, tag.index));
      if (isSubmit && /(^|\s)(:?disabled)(\s*=|\s|$|\/)/.test(a) && !/aria-disabled/.test(a))
        add("disabled-submit", "warning", tag.index, "Submit button can be disabled; people can't find out what's missing.", "Keep it enabled and validate on submit with an error summary, or use aria-disabled with a visible reason next to it.");
      if (!/aria-label(ledby)?\s*=|\btitle\s*=|\{\s*\.\.\./.test(a)) {
        const close = clean.indexOf(`</${tag.name}>`, tag.end);
        if (close !== -1) {
          const inner = clean.slice(tag.end + 1, close);
          const text = inner.replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]*>/g, "").trim();
          const hasIcon = /<svg|<[A-Z]\w*Icon|<Icon|<img/.test(inner);
          if (hasIcon && text === "" && !/aria-label|sr-only|visually-hidden/.test(inner))
            add("icon-button-name", "error", tag.index, "Icon-only button without an accessible name.", 'Add aria-label="Verb + object" (e.g. "Close", "Delete invoice") or visually hidden text.');
        }
      }
    }
  }
  return findings;
}

function insideForm(src, index) {
  const open = src.lastIndexOf("<form", index);
  return open !== -1 && src.lastIndexOf("</form>", index) < open;
}

/** Find opening tags and their attribute strings, respecting quotes and {} nesting. */
function scanTags(src, re) {
  const tags = [];
  for (const m of src.matchAll(re)) {
    let i = m.index + m[0].length, depth = 0, quote = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (quote) { if (c === quote) quote = null; continue; }
      if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
      if (c === "{") depth++;
      else if (c === "}") depth--;
      else if (c === ">" && depth <= 0) break;
    }
    tags.push({ name: m[1], index: m.index, end: i, attrs: src.slice(m.index + m[0].length, i) });
  }
  return tags;
}

// ---------- public API ----------

export function lintSource(file, src, cfg = loadConfig()) {
  return checkFile(file, src, cfg).sort((a, b) => a.line - b.line || a.col - b.col);
}

export function lint(paths, cfg = loadConfig()) {
  const files = collectFiles(paths, cfg);
  const findings = [];
  for (const f of files) findings.push(...checkFile(f, readFileSync(f, "utf8"), cfg));
  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.col - b.col);
  return { files: files.length, findings };
}

export function format(findings, cwd = process.cwd()) {
  if (findings.length === 0) return "";
  const byFile = new Map();
  for (const f of findings) (byFile.get(f.file) ?? byFile.set(f.file, []).get(f.file)).push(f);
  const out = [];
  for (const [file, list] of byFile) {
    out.push(relative(cwd, file) || file);
    for (const f of list) out.push(`  ${String(f.line).padStart(4)}:${String(f.col).padEnd(3)} ${f.severity.padEnd(7)} ${f.rule.padEnd(17)} ${f.message}\n${" ".repeat(42)}→ ${f.fix}`);
  }
  return out.join("\n");
}
