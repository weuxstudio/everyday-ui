// everyday-shots core: renders routes of any running app the way the Everyday UI review asks for
// (375 px and 1280 px, light/dark, squint, keyboard focus pass, reduced motion, 200 % zoom) and
// writes an HTML contact sheet with the findings a screenshot alone doesn't show.

import { createServer } from "node:http";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, isAbsolute, join, normalize, resolve } from "node:path";


export const DEFAULTS = {
  baseUrl: "http://localhost:5173",
  routes: ["/"],
  viewports: { phone: [375, 812], desktop: [1280, 800] },
  schemes: ["light", "dark"],
  variants: ["squint", "keyboard", "reduced-motion", "zoom"],
  keyboardTabs: 8,
  squintBlur: 6,
  fullPage: true,
  dpr: 1,
  waitFor: null, // CSS selector to wait for on every route
  settle: 400, // ms after load (fonts, transitions)
  init: null, // path to a script run before the page's own scripts (e.g. set a token in localStorage)
  mocks: null, // path to a JSON file: { "<url glob>": { "status": 200, "json": {…} } | { "file": "x.json" } }
  out: "everyday-shots",
};

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon" };

export function loadConfig(cwd, file, overrides = {}) {
  let cfg = { ...DEFAULTS };
  const path = file ? resolve(cwd, file) : join(cwd, "everyday.shots.json");
  if (existsSync(path)) cfg = { ...cfg, ...JSON.parse(readFileSync(path, "utf8")), $dir: resolve(path, "..") };
  else cfg.$dir = cwd;
  for (const [k, v] of Object.entries(overrides)) if (v !== undefined) cfg[k] = v;
  cfg.routes = cfg.routes.map((r) => (typeof r === "string" ? { path: r } : r)).map((r) => ({ name: r.name ?? slug(r.path), ...r }));
  return cfg;
}

const slug = (p) => (p.replace(/^\/+|\/+$/g, "").replace(/[^\w-]+/g, "-") || "home").slice(0, 60);

/** Minimal static server for built sites or HTML blueprints (--serve <dir>). */
export function serveStatic(dir, port = 0) {
  const root = resolve(dir);
  const server = createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = normalize(join(root, url));
    if (!file.startsWith(root)) return res.writeHead(403).end();
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file)) {
      const spa = join(root, "index.html"); // SPA fallback
      if (!existsSync(spa)) return res.writeHead(404).end("not found");
      file = spa;
    }
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
  });
  return new Promise((ok) => server.listen(port, "127.0.0.1", () => ok({ server, url: `http://127.0.0.1:${server.address().port}` })));
}

async function loadPlaywright() {
  const names = ["playwright", "playwright-core", "@playwright/test"];
  for (const name of names) {
    try {
      const mod = await import(name);
      return mod.chromium ? mod : mod.default;
    } catch {
      /* try next */
    }
  }
  // Resolve from the project folder (and NODE_PATH / global installs), not only from this package.
  const req = createRequire(join(process.cwd(), "noop.js"));
  for (const name of names) {
    try {
      return req(name);
    } catch {
      /* try next */
    }
  }
  throw new Error("everyday-shots needs Playwright: npm i -D playwright && npx playwright install chromium");
}

function globToRegExp(glob) {
  return new RegExp("^" + glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*").replace(/\u0000/g, ".*") + "$");
}

async function applyMocks(context, cfg) {
  if (!cfg.mocks) return;
  const file = isAbsolute(cfg.mocks) ? cfg.mocks : join(cfg.$dir, cfg.mocks);
  const map = JSON.parse(readFileSync(file, "utf8"));
  const base = resolve(file, "..");
  for (const [glob, spec] of Object.entries(map)) {
    const re = globToRegExp(glob);
    await context.route((url) => re.test(url.toString()), (route) => {
      const body = spec.file ? readFileSync(join(base, spec.file)) : JSON.stringify(spec.json ?? spec.body ?? {});
      route.fulfill({ status: spec.status ?? 200, contentType: spec.contentType ?? "application/json", body });
    });
  }
}

/** What a screenshot can't show: overflow, small targets, missing names, console errors. */
async function inspect(page) {
  return page.evaluate(() => {
    const issues = [];
    const doc = document.scrollingElement || document.documentElement;
    if (doc.scrollWidth > window.innerWidth + 1) issues.push(`Horizontal scroll: content is ${doc.scrollWidth}px wide in a ${window.innerWidth}px viewport`);
    const small = [];
    for (const el of document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="switch"], [role="tab"]')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || el.closest("[inert], [aria-hidden='true']")) continue;
      // inline text links are exempt (WCAG 2.5.8 inline exception)
      if (el.tagName === "A" && cs.display === "inline") continue;
      // invisible hit-area extensions via ::after count
      const after = getComputedStyle(el, "::after");
      const extra = after.content !== "none" && after.position === "absolute" ? 8 : 0;
      if (Math.min(r.width, r.height) + extra < 24) small.push(`${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    if (small.length) issues.push(`Targets under 24 px (WCAG 2.5.8): ${small.slice(0, 5).join("; ")}${small.length > 5 ? ` and ${small.length - 5} more` : ""}`);
    const unnamed = [...document.querySelectorAll("button, a[href]")].filter((el) => {
      const name = (el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.getAttribute("title") || el.textContent || "").trim();
      return !name && !el.querySelector("img[alt]:not([alt=''])");
    });
    if (unnamed.length) issues.push(`${unnamed.length} button(s)/link(s) without an accessible name`);
    if (!document.documentElement.lang) issues.push("<html> has no lang attribute");
    const h1 = [...document.querySelectorAll("h1")].filter((el) => (el.checkVisibility ? el.checkVisibility() : el.offsetParent !== null)).length;
    if (h1 !== 1) issues.push(`${h1} h1 elements (expected 1)`);
    return issues;
  });
}

async function keyboardPass(page, tabs) {
  const stops = [];
  await page.evaluate(() => { document.activeElement?.blur?.(); window.scrollTo(0, 0); });
  for (let i = 0; i < tabs; i++) {
    await page.keyboard.press("Tab");
    stops.push(await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return "(body)";
      const cs = getComputedStyle(el);
      const visible = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none";
      const name = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || "").trim().replace(/\s+/g, " ").slice(0, 40);
      return `${el.tagName.toLowerCase()}${el.getAttribute("role") ? `[${el.getAttribute("role")}]` : ""} "${name}"${visible ? "" : "  ⚠ no visible focus style"}`;
    }));
  }
  return stops;
}

export async function run(cfg, log = console.log) {
  const pw = await loadPlaywright();
  const outDir = resolve(cfg.$dir, cfg.out);
  mkdirSync(outDir, { recursive: true });
  const browser = await pw.chromium.launch();
  const results = [];
  const initScript = cfg.init ? readFileSync(isAbsolute(cfg.init) ? cfg.init : join(cfg.$dir, cfg.init), "utf8") : null;

  try {
    for (const route of cfg.routes) {
      for (const [vpName, [w, h]] of Object.entries(cfg.viewports)) {
        for (const scheme of cfg.schemes) {
          const shots = [];
          const consoleErrors = [];
          const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: cfg.dpr, colorScheme: scheme, hasTouch: vpName === "phone" });
          if (initScript) await context.addInitScript(initScript);
          await applyMocks(context, cfg);
          const page = await context.newPage();
          page.on("pageerror", (e) => consoleErrors.push(e.message));
          page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
          const url = new URL(route.path, cfg.baseUrl.endsWith("/") ? cfg.baseUrl : cfg.baseUrl + "/").toString();
          const base = `${route.name}--${vpName}--${scheme}`;

          await page.goto(url, { waitUntil: "load" });
          if (route.waitFor ?? cfg.waitFor) await page.waitForSelector(route.waitFor ?? cfg.waitFor, { timeout: 10000 });
          for (const a of route.actions ?? []) {
            if (a.click) await page.click(a.click);
            if (a.fill) await page.fill(a.fill[0], a.fill[1]);
            if (a.press) await page.keyboard.press(a.press);
            if (a.wait) await page.waitForTimeout(a.wait);
          }
          await page.waitForTimeout(cfg.settle);

          const file = (v) => `${base}${v ? `--${v}` : ""}.png`;
          await page.screenshot({ path: join(outDir, file()), fullPage: cfg.fullPage });
          shots.push({ variant: "default", file: file() });
          const issues = await inspect(page);

          if (cfg.variants.includes("squint") && scheme === cfg.schemes[0]) {
            const handle = await page.addStyleTag({ content: `html { filter: blur(${cfg.squintBlur}px) !important; }` });
            await page.screenshot({ path: join(outDir, file("squint")), fullPage: false });
            await handle.evaluate((n) => n.remove());
            shots.push({ variant: "squint", file: file("squint") });
          }
          let tabStops = null;
          if (cfg.variants.includes("keyboard") && scheme === cfg.schemes[0]) {
            tabStops = await keyboardPass(page, cfg.keyboardTabs);
            await page.screenshot({ path: join(outDir, file("keyboard")), fullPage: false });
            shots.push({ variant: `keyboard (Tab ×${cfg.keyboardTabs})`, file: file("keyboard") });
          }
          if (cfg.variants.includes("reduced-motion") && scheme === cfg.schemes[0]) {
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.reload({ waitUntil: "load" });
            if (route.waitFor ?? cfg.waitFor) await page.waitForSelector(route.waitFor ?? cfg.waitFor);
            await page.waitForTimeout(cfg.settle);
            await page.screenshot({ path: join(outDir, file("reduced-motion")), fullPage: false });
            shots.push({ variant: "reduced motion", file: file("reduced-motion") });
          }
          await context.close();

          // 200 % zoom = half the CSS viewport at double density (desktop only; phones use text size)
          if (cfg.variants.includes("zoom") && vpName !== "phone" && scheme === cfg.schemes[0]) {
            const z = await browser.newContext({ viewport: { width: Math.round(w / 2), height: Math.round(h / 2) }, deviceScaleFactor: 2 * cfg.dpr, colorScheme: scheme });
            if (initScript) await z.addInitScript(initScript);
            await applyMocks(z, cfg);
            const zp = await z.newPage();
            await zp.goto(url, { waitUntil: "load" });
            if (route.waitFor ?? cfg.waitFor) await zp.waitForSelector(route.waitFor ?? cfg.waitFor);
            await zp.waitForTimeout(cfg.settle);
            await zp.screenshot({ path: join(outDir, file("zoom200")), fullPage: cfg.fullPage });
            const zIssues = await inspect(zp);
            for (const i of zIssues) if (i.startsWith("Horizontal scroll")) issues.push(`At 200 % zoom: ${i}`);
            shots.push({ variant: "200 % zoom", file: file("zoom200") });
            await z.close();
          }

          results.push({ route: route.name, path: route.path, viewport: vpName, size: `${w}×${h}`, scheme, shots, issues, consoleErrors, tabStops });
          log(`  ${route.name} · ${vpName} · ${scheme}: ${shots.length} shot(s)${issues.length ? `, ${issues.length} issue(s)` : ""}${consoleErrors.length ? `, ${consoleErrors.length} console error(s)` : ""}`);
        }
      }
    }
  } finally {
    await browser.close();
  }

  writeFileSync(join(outDir, "report.json"), JSON.stringify(results, null, 2));
  writeFileSync(join(outDir, "index.html"), contactSheet(results, cfg));
  return { outDir, results, sheet: join(outDir, "index.html") };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function contactSheet(results, cfg) {
  const rows = results
    .map(
      (r) => `<section>
  <h2>${esc(r.route)} <span>${esc(r.path)} · ${esc(r.viewport)} ${esc(r.size)} · ${esc(r.scheme)}</span></h2>
  ${r.issues.length || r.consoleErrors.length ? `<ul class="issues">${[...r.issues, ...r.consoleErrors.map((e) => `Console error: ${e}`)].map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : `<p class="ok">No automatic findings.</p>`}
  <div class="strip">${r.shots.map((s) => `<figure><a href="${esc(s.file)}"><img src="${esc(s.file)}" alt="${esc(`${r.route}, ${r.viewport}, ${r.scheme}, ${s.variant}`)}" loading="lazy"></a><figcaption>${esc(s.variant)}</figcaption></figure>`).join("")}</div>
  ${r.tabStops ? `<details><summary>Tab order (first ${r.tabStops.length} stops)</summary><ol>${r.tabStops.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></details>` : ""}
</section>`,
    )
    .join("\n");
  const total = results.reduce((n, r) => n + r.issues.length + r.consoleErrors.length, 0);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>everyday-shots</title><style>
:root{color-scheme:light dark;--bg:#f6f6f4;--fg:#1d1d1b;--muted:#5f5f5a;--card:#fff;--line:#d9d9d4;--warn:#8a4b00;--warnbg:#fff3df}
@media (prefers-color-scheme:dark){:root{--bg:#161615;--fg:#eeeeea;--muted:#a9a9a2;--card:#1f1f1e;--line:#3a3a37;--warn:#ffc77a;--warnbg:#3a2a12}}
body{margin:0;padding:24px 16px 80px;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif}
main{max-width:1600px;margin:0 auto;display:flex;flex-direction:column;gap:32px}
h1{margin:0;font-size:24px}h2{margin:0 0 8px;font-size:18px}h2 span{color:var(--muted);font-weight:400;font-size:14px}
section{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}
.strip{display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;align-items:flex-start}
figure{margin:0;flex:none}figure img{display:block;max-height:560px;width:auto;border:1px solid var(--line);border-radius:8px}
figcaption{font-size:14px;color:var(--muted);margin-top:4px}
.issues{margin:0 0 16px;padding:8px 8px 8px 32px;background:var(--warnbg);color:var(--warn);border-radius:8px}.ok{color:var(--muted);margin:0 0 16px}
details{margin-top:8px}ol{font-family:ui-monospace,monospace;font-size:13px}
</style></head><body><main>
<header><h1>everyday-shots</h1><p>${results.length} renders of ${esc(cfg.baseUrl)} · ${total} automatic finding(s). Look at each squint shot: the primary action and the purpose must still stand out. Automatic findings don't replace the review checklist.</p></header>
${rows}
</main></body></html>`;
}

