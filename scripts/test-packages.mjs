// Build installed consumers outside the monorepo so workspace links cannot satisfy imports.
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { sveltePlugin } from "./svelte-esbuild.mjs";

const root = resolve(import.meta.dirname, "..");
const temp = mkdtempSync(join(tmpdir(), "everyday-consumers-"));
const version = (name) => JSON.parse(readFileSync(join(root, "node_modules", name, "package.json"))).version;
function npm(cwd, ...args) {
  return execFileSync("npm", args, { cwd, encoding: "utf8" });
}

try {
  const skill = join(temp, "skills/everyday-ui");
  cpSync(join(root, "skills/everyday-ui"), skill, { recursive: true });
  const packs = {};
  for (const name of ["tokens", "react", "svelte", "lint", "shots"]) {
    const [result] = JSON.parse(npm(join(root, "packages", name), "pack", "--json", "--pack-destination", temp));
    packs[name] = join(temp, result.filename);
  }
  for (const adapter of ["react", "svelte"]) {
    const cwd = join(temp, adapter);
    mkdirSync(cwd);
    const deps = { tailwindcss: version("tailwindcss"), "@tailwindcss/cli": version("@tailwindcss/cli") };
    for (const name of ["tokens", adapter, "lint", "shots"]) deps["@everyday-ui/" + name] = "file:" + packs[name];
    for (const name of adapter === "react" ? ["react", "react-dom"] : ["svelte"]) deps[name] = version(name);
    writeFileSync(join(cwd, "package.json"), JSON.stringify({ private: true, type: "module", dependencies: deps }));
    npm(cwd, "install", "--prefer-offline", "--no-audit", "--no-fund");
    const brief = readFileSync(join(skill, "templates/everyday.md"), "utf8")
      .replace("**What it is (one sentence):**", "**What it is (one sentence):** Account registration for Atlas Studio.")
      .replace("**Their main job here:**", "**Their main job here:** Create an account, recover from input errors and reach onboarding.");
    writeFileSync(join(cwd, "everyday.md"), brief);
    npm(cwd, "exec", "--", "everyday-theme", "init", "--preset", "neutral", "--out", "theme");
    cpSync(join(skill, "patterns/signup-onboarding"), join(cwd, "signup"), { recursive: true });
    const entry = adapter === "react" ? "Contract.tsx" : "svelte-main.ts";
    for (const file of adapter === "react" ? [entry] : [entry, "Contract.svelte"]) cpSync(join(root, "tests/fixtures", file), join(cwd, file));
    npm(cwd, "exec", "--", "everyday-lint", "signup", "--max-warnings", "0");
    npm(cwd, "exec", "--", "everyday-shots", "--help");
    const out = join(root, "tests/dist", adapter);
    mkdirSync(out, { recursive: true });
    cpSync(join(cwd, "everyday.md"), join(out, "everyday.md"));
    cpSync(join(cwd, "everyday.theme.json"), join(out, "everyday.theme.json"));
    await build({ absWorkingDir: cwd, entryPoints: [entry], outfile: join(out, "app.js"), bundle: true, format: "esm", jsx: "automatic",
      conditions: ["browser", ...(adapter === "svelte" ? ["svelte"] : [])], plugins: adapter === "svelte" ? [sveltePlugin] : [] });
    writeFileSync(join(cwd, "app.css"), [
      '@import "tailwindcss";', '@import "./theme/tailwind.css";', `@import "@everyday-ui/${adapter}/styles.css";`,
      `@source "./node_modules/@everyday-ui/${adapter}/src";`
    ].join("\n"));
    npm(cwd, "exec", "--", "tailwindcss", "-i", "app.css", "-o", join(out, "app.css"), "--minify");
    writeFileSync(join(out, "index.html"), '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Installed consumer</title><link rel="stylesheet" href="app.css"><div id="app"></div><script type="module" src="app.js"></script></html>');
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
