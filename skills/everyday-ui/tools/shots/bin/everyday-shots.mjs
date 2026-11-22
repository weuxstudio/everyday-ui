#!/usr/bin/env node
// everyday-shots: screenshots + squint test + keyboard pass for any project, with a contact sheet.
//
//   everyday-shots [baseUrl] [routes…]     e.g. everyday-shots http://localhost:5173 / /settings
//   --serve <dir>        serve a static folder (built site, HTML blueprint) instead of a URL
//   --config <file>      config file (default: ./everyday.shots.json)
//   --out <dir>          output folder (default: ./everyday-shots)
//   --only <viewport>    phone | desktop (or any viewport name from the config)
//   --light-only         skip dark mode (projects that ship light only)
//   --dpr <n>            device pixel ratio (default 1; 2 for screenshots people will look at)
//
// Writes <out>/index.html (contact sheet), report.json and the PNGs. Needs Playwright.
import { readFileSync } from "node:fs";
import { loadConfig, run, serveStatic } from "../lib/shots.mjs";

const args = process.argv.slice(2);
const valueFlags = ["--serve", "--config", "--out", "--only", "--dpr"];
const opts = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (valueFlags.includes(a)) opts[a.slice(2)] = args[++i];
  else if (a.startsWith("--")) opts[a.slice(2)] = true;
  else positional.push(a);
}
if (opts.help || opts.h) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 13).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(0);
}

let server;
const overrides = { out: opts.out, dpr: opts.dpr ? Number(opts.dpr) : undefined };
if (opts.serve) {
  const s = await serveStatic(opts.serve);
  server = s.server;
  overrides.baseUrl = s.url;
} else if (positional[0] && /^https?:\/\//.test(positional[0])) overrides.baseUrl = positional.shift();
if (positional.length) overrides.routes = positional;

const cfg = loadConfig(process.cwd(), opts.config, overrides);
if (opts.only) cfg.viewports = Object.fromEntries(Object.entries(cfg.viewports).filter(([k]) => k === opts.only));
if (opts["light-only"]) cfg.schemes = ["light"];

console.log(`everyday-shots: ${cfg.baseUrl} · ${cfg.routes.length} route(s) · ${Object.keys(cfg.viewports).join(", ")} · ${cfg.schemes.join(", ")}`);
try {
  const { sheet, results } = await run(cfg);
  const findings = results.reduce((n, r) => n + r.issues.length + r.consoleErrors.length, 0);
  console.log(`\nContact sheet: ${sheet}\n${findings} automatic finding(s). Now look at the shots: squint test, focus, dark mode.`);
} catch (e) {
  console.error(`everyday-shots: ${e.message}`);
  process.exitCode = 1;
} finally {
  server?.close();
}
