#!/usr/bin/env node
// everyday-lint: checks Everyday UI rules that are mechanical, so reviews can focus on judgment.
//
//   everyday-lint [paths…]            scan files (default: src)
//   --json                            machine-readable output
//   --max-warnings <n>                fail when there are more warnings (default: unlimited)
//   --config <file>                   config file (default: ./everyday.lint.json)
//   --rules                           list rules
//
// Exit code 1 when there are errors (or too many warnings). Ignore a justified case with a
// comment on the same or previous line: everyday-lint-ignore spacing -- reason
// (or everyday-lint-ignore-next-line / everyday-lint-ignore-file).
import { existsSync } from "node:fs";
import { RULES, format, lint, loadConfig } from "../lib/lint.mjs";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const consumed = new Set();
["--max-warnings", "--config"].forEach((n) => {
  const i = args.indexOf(n);
  if (i !== -1) consumed.add(i).add(i + 1);
});
const paths = args.filter((a, i) => !a.startsWith("--") && !consumed.has(i));

if (flag("--help") || flag("-h")) {
  console.log((await import("node:fs")).readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 12).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(0);
}
if (flag("--rules")) {
  for (const [k, v] of Object.entries(RULES)) console.log(`${k.padEnd(18)} ${v}`);
  process.exit(0);
}

const targets = paths.length ? paths : ["src"].filter(existsSync);
if (targets.length === 0) {
  console.error("everyday-lint: no paths given and no ./src folder. Usage: everyday-lint <paths…>");
  process.exit(2);
}

const cfg = loadConfig(process.cwd(), opt("--config"));
let result;
try {
  result = lint(targets, cfg);
} catch (e) {
  console.error(e.message);
  process.exit(2);
}
const { files, findings } = result;
const errors = findings.filter((f) => f.severity === "error").length;
const warnings = findings.length - errors;
const maxWarnings = opt("--max-warnings") !== undefined ? Number(opt("--max-warnings")) : Infinity;

if (flag("--json")) {
  console.log(JSON.stringify({ files, errors, warnings, fontWeights: cfg.fontWeights, findings }, null, 2));
} else {
  const text = format(findings);
  if (text) console.log(text + "\n");
  console.log(`everyday-lint: ${files} files, ${errors} error${errors === 1 ? "" : "s"}, ${warnings} warning${warnings === 1 ? "" : "s"} (weights allowed: ${cfg.fontWeights.join(", ")})`);
}
process.exit(errors > 0 || warnings > maxWarnings ? 1 : 0);
