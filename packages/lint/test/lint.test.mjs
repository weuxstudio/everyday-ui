import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { lint, loadConfig, lintSource } from "../lib/lint.mjs";

const dir = fileURLToPath(new URL("./fixtures", import.meta.url));
const cfg = loadConfig(dir);
const { findings } = lint([join(dir, "src")], cfg);
const of = (name) => findings.filter((f) => f.file.endsWith(name));
const rules = (name) => of(name).map((f) => `${f.rule}:${f.line}`).sort();

test("bad React file: every rule fires where expected", () => {
  const r = rules("Bad.tsx");
  for (const expected of [
    "native-dialog:3", // confirm
    "spacing:6", // gap-5
    "font-weight:6", // font-bold
    "raw-color:7", // text-gray-500 / bg-[#ff0000]
    "raw-color:8", // "#123456"
    "font-weight:8", // fontWeight: 300
    "disabled-submit:9",
    "icon-button-name:10",
  ]) assert.ok(r.includes(expected), `missing ${expected} in ${r.join(", ")}`);
  assert.equal(of("Bad.tsx").filter((f) => f.rule === "native-dialog").length, 2, "confirm and alert");
  assert.ok(!r.some((x) => x.endsWith(":13")), "href=\"#add\" is not a colour");
});

test("good React file: no findings (member calls, labelled icon buttons, ignore comments)", () => {
  assert.deepEqual(of("Good.tsx"), []);
});

test("half steps are allowed inside components", () => {
  assert.deepEqual(of("components/Chip.tsx"), []);
});

test("CSS: off-scale values, weights, raw colours, unknown tokens; comments and env() ignored", () => {
  const r = rules("styles.css");
  assert.deepEqual(r, ["font-weight:3", "raw-color:3", "raw-color:3", "spacing:3", "spacing:3", "spacing:5"].sort());
  const unknown = of("styles.css").find((f) => f.line === 5);
  assert.equal(unknown.severity, "warning");
});

test("token files may hold raw values", () => {
  assert.deepEqual(of("tokens.css"), []);
});

test("Svelte: implicit submit disabled, icon-only button, style block", () => {
  const r = rules("Widget.svelte");
  assert.ok(r.includes("disabled-submit:5"));
  assert.ok(r.includes("icon-button-name:6"));
  assert.ok(r.includes("spacing:9") && r.includes("font-weight:9"));
});

test("Vue: :disabled binding on submit, off-scale py-3", () => {
  const r = rules("Card.vue");
  assert.ok(r.includes("disabled-submit:2"));
  assert.ok(r.includes("spacing:2"));
});

test("theme heading weight extends the allowed weights", () => {
  const c = { ...cfg, fontWeights: [400, 600, 500] };
  assert.deepEqual(lintSource("x.css", ".h { font-weight: 500 }", c), []);
  assert.equal(lintSource("x.css", ".h { font-weight: 500 }", cfg).length, 1);
});

test("rules can be switched off in config", () => {
  const c = { ...cfg, rules: { "native-dialog": "off" } };
  assert.deepEqual(lintSource("a.ts", "confirm('x')", c), []);
});
